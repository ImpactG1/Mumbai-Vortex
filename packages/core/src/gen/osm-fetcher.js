/**
 * Voxel Mumbai - OpenStreetMap Data Fetcher & IndexedDB Cache
 * Fetches real OSM features via Overpass API with mirror failover, backoff,
 * IndexedDB caching, and guaranteed bundled offline preset fallback.
 */

import { openDB } from 'idb';
import { BUNDLED_PRESET_DATA } from './bundled-presets.js';

const DB_NAME = 'voxel_mumbai_cache_v1';
const STORE_NAME = 'osm_tiles';

// Public Overpass API mirrors
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];

let activeMirrorIndex = 0;

/**
 * Returns or initializes IndexedDB database
 */
async function getCacheDB() {
  if (typeof indexedDB === 'undefined') return null;
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    }
  });
}

/**
 * Builds an Overpass QL query string for a bounding box [south, west, north, east]
 */
function buildOverpassQuery(bbox) {
  const [south, west, north, east] = bbox;
  const bboxStr = `${south.toFixed(5)},${west.toFixed(5)},${north.toFixed(5)},${east.toFixed(5)}`;

  return `[out:json][timeout:15];
(
  way["building"](${bboxStr});
  relation["building"](${bboxStr});
  way["highway"](${bboxStr});
  way["railway"](${bboxStr});
  way["natural"](${bboxStr});
  relation["natural"](${bboxStr});
  way["leisure"](${bboxStr});
  way["man_made"](${bboxStr});
);
out body;
>;
out skel qt;`;
}

export class OsmFetcher {
  constructor() {
    this.dbPromise = getCacheDB();
  }

  /**
   * Fetches OSM data for a location. Checks:
   * 1. IndexedDB cache
   * 2. Live Overpass API (with 4-second timeout & mirror rotation)
   * 3. Bundled offline preset dataset fallback
   *
   * @param {string} presetId - preset identifier if applicable
   * @param {[number, number, number, number]} bbox - [south, west, north, east]
   * @returns {Promise<Object>} GeoJSON FeatureCollection
   */
  async fetchTile(presetId, bbox) {
    const cacheKey = presetId || `bbox_${bbox.map(n => n.toFixed(4)).join('_')}`;

    // 1. Check IndexedDB cache
    try {
      const db = await this.dbPromise;
      if (db) {
        const cached = await db.get(STORE_NAME, cacheKey);
        if (cached) {
          console.log(`[OSM] Loaded ${cacheKey} from IndexedDB cache`);
          return cached;
        }
      }
    } catch (e) {
      console.warn('[OSM] Cache read error, continuing:', e);
    }

    // 2. Try Live Overpass API with short timeout
    let liveData = null;
    try {
      liveData = await this.fetchFromOverpassWithTimeout(bbox, 4500);
    } catch (err) {
      console.warn(`[OSM] Live Overpass failed or timed out: ${err.message}. Using offline fallback.`);
    }

    if (liveData && liveData.features && liveData.features.length > 0) {
      // Save to IndexedDB
      try {
        const db = await this.dbPromise;
        if (db) await db.put(STORE_NAME, liveData, cacheKey);
      } catch (e) {}
      return liveData;
    }

    // 3. Fallback to bundled offline dataset for presets
    if (presetId && BUNDLED_PRESET_DATA[presetId]) {
      console.log(`[OSM] Using bundled offline preset dataset for "${presetId}"`);
      return BUNDLED_PRESET_DATA[presetId];
    }

    // Default fallback to Marine Drive bundle if all else fails
    console.log('[OSM] Using default Marine Drive bundled dataset');
    return BUNDLED_PRESET_DATA.marine_drive;
  }

  /**
   * Fetches from Overpass with mirror failover and timeout
   */
  async fetchFromOverpassWithTimeout(bbox, timeoutMs) {
    const query = buildOverpassQuery(bbox);
    const mirror = OVERPASS_MIRRORS[activeMirrorIndex];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(mirror, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'VoxelMumbai/1.0 (https://voxel-mumbai.local)'
        },
        body: 'data=' + encodeURIComponent(query),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Overpass returned HTTP ${response.status}`);
      }

      const json = await response.json();
      return this.convertOverpassToGeoJSON(json);
    } catch (e) {
      clearTimeout(timeoutId);
      // Rotate mirror for next time
      activeMirrorIndex = (activeMirrorIndex + 1) % OVERPASS_MIRRORS.length;
      throw e;
    }
  }

  /**
   * Converts raw Overpass JSON elements (nodes, ways) to a GeoJSON FeatureCollection
   */
  convertOverpassToGeoJSON(osmJson) {
    if (!osmJson || !osmJson.elements) {
      return { type: 'FeatureCollection', features: [] };
    }

    const nodes = new Map();
    for (const el of osmJson.elements) {
      if (el.type === 'node') {
        nodes.set(el.id, [el.lon, el.lat]);
      }
    }

    const features = [];

    for (const el of osmJson.elements) {
      if (el.type === 'way' && el.nodes && el.nodes.length >= 2) {
        const coords = [];
        for (const nodeId of el.nodes) {
          const pt = nodes.get(nodeId);
          if (pt) coords.push(pt);
        }

        if (coords.length < 2) continue;

        const isClosed = coords.length >= 4 &&
          coords[0][0] === coords[coords.length - 1][0] &&
          coords[0][1] === coords[coords.length - 1][1];

        const isArea = isClosed && (el.tags?.building || el.tags?.natural === 'water' || el.tags?.leisure);

        if (isArea) {
          features.push({
            type: 'Feature',
            properties: el.tags || {},
            geometry: {
              type: 'Polygon',
              coordinates: [coords]
            }
          });
        } else {
          features.push({
            type: 'Feature',
            properties: el.tags || {},
            geometry: {
              type: 'LineString',
              coordinates: coords
            }
          });
        }
      }
    }

    return { type: 'FeatureCollection', features };
  }
}
