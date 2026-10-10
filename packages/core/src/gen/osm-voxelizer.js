/**
 * Voxel Mumbai - Real World OSM Voxelizer (Phase 3)
 * Generates true Mumbai architecture, landmarks, roads, railways, and coastlines
 * with solid perimeter walls, architectural windows, and landmark voxel stamps.
 */

import { BLOCKS } from '../world/block-registry.js';
import { CHUNK_SIZE_X, CHUNK_SIZE_Y, CHUNK_SIZE_Z, SEA_LEVEL } from '../world/constants.js';
import { rasterizePolygon, rasterizePolyline } from './polygon-rasterizer.js';
import { LandmarkRegistry } from './landmarks.js';

export class OsmVoxelizer {
  /**
   * @param {Object} geoJson - GeoJSON FeatureCollection
   * @param {import('./projection.js').EquirectangularProjection} projection
   * @param {import('./elevation.js').ElevationSampler} elevationSampler
   * @param {Object} [preset]
   */
  constructor(geoJson, projection, elevationSampler, preset = {}) {
    this.geoJson = geoJson;
    this.projection = projection;
    this.elevationSampler = elevationSampler;
    this.preset = preset;

    this.projectedFeatures = [];
    this.coastlinePolyline = null;
    this.preprocessFeatures();
  }

  preprocessFeatures() {
    if (!this.geoJson || !this.geoJson.features) return;

    for (const feat of this.geoJson.features) {
      const geom = feat.geometry;
      if (!geom) continue;

      if (geom.type === 'LineString') {
        const pts = geom.coordinates.map(([lon, lat]) => {
          const { x, z } = this.projection.project(lat, lon);
          return [x, z];
        });

        if (feat.properties?.natural === 'coastline') {
          this.coastlinePolyline = pts;
        }

        this.projectedFeatures.push({
          type: 'line',
          properties: feat.properties,
          points: pts
        });
      } else if (geom.type === 'Polygon') {
        const rings = geom.coordinates.map(ring => {
          return ring.map(([lon, lat]) => {
            const { x, z } = this.projection.project(lat, lon);
            return [x, z];
          });
        });

        this.projectedFeatures.push({
          type: 'polygon',
          properties: feat.properties,
          exterior: rings[0],
          interiors: rings.slice(1)
        });
      }
    }
  }

  /**
   * Voxelizes a single chunk
   * @param {import('../world/chunk.js').Chunk} chunk
   */
  voxelizeChunk(chunk) {
    const cx = chunk.cx;
    const cz = chunk.cz;
    const originX = cx * CHUNK_SIZE_X;
    const originZ = cz * CHUNK_SIZE_Z;

    // 1. Base Geology & Flat Coastal Ground
    this.fillBaseTerrain(chunk, originX, originZ);

    // 2. Linear Features (Coastline, Tetrapods, Roads, Rails)
    this.rasterizeLines(chunk, originX, originZ);

    // 3. Polygons & Buildings with True Solid Perimeter Walls
    this.rasterizePolygons(chunk, originX, originZ);

    // 4. Street Life (Taxis, Buses, Street Lanterns)
    this.addAmbientProps(chunk, originX, originZ);

    chunk.dirty = true;
  }

  fillBaseTerrain(chunk, originX, originZ) {
    for (let lz = 0; lz < CHUNK_SIZE_Z; lz++) {
      for (let lx = 0; lx < CHUNK_SIZE_X; lx++) {
        const wx = originX + lx;
        const wz = originZ + lz;

        // Bedrock
        chunk.setBlock(lx, 0, lz, BLOCKS.BASALT);

        // Subsurface basalt & laterite stone
        for (let y = 1; y < 18; y++) {
          chunk.setBlock(lx, y, lz, (y < 8) ? BLOCKS.STONE : BLOCKS.LATERITE);
        }

        // Soil
        chunk.setBlock(lx, 18, lz, BLOCKS.DIRT);
        chunk.setBlock(lx, 19, lz, BLOCKS.DIRT);

        const isSea = this.isCoordinateSea(wx, wz);

        if (isSea) {
          // Fill Arabian Sea water to SEA_LEVEL (y = 20)
          for (let y = 1; y <= SEA_LEVEL; y++) {
            chunk.setBlock(lx, y, lz, BLOCKS.SEA_WATER);
          }
        } else {
          // Solid ground foundation at y = 20
          chunk.setBlock(lx, 20, lz, BLOCKS.DIRT);
          // Ground surface at y = 21: default warm grass
          chunk.setBlock(lx, 21, lz, BLOCKS.GRASS);
        }
      }
    }
  }

  isCoordinateSea(wx, wz) {
    if (this.preset.waterSide === 'west') {
      if (this.coastlinePolyline && this.coastlinePolyline.length >= 2) {
        const coastX = this.getCoastlineXAtZ(wz);
        if (coastX !== null) {
          return wx < coastX;
        }
      }
      return wx < -45;
    } else if (this.preset.waterSide === 'east') {
      return wx > 35;
    }
    return false;
  }

  getCoastlineXAtZ(wz) {
    const pts = this.coastlinePolyline;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, z0] = pts[i];
      const [x1, z1] = pts[i + 1];
      if ((z0 <= wz && z1 >= wz) || (z1 <= wz && z0 >= wz)) {
        const t = (wz - z0) / (z1 - z0 + 0.0001);
        return x0 + t * (x1 - x0);
      }
    }
    return null;
  }

  rasterizeLines(chunk, originX, originZ) {
    for (const feat of this.projectedFeatures) {
      if (feat.type !== 'line') continue;
      const props = feat.properties || {};

      // 1. Marine Drive Breakwater Tetrapods
      if (props.man_made === 'breakwater') {
        const cells = rasterizePolyline(feat.points, 6);
        for (const cell of cells) {
          const lx = cell.x - originX;
          const lz = cell.z - originZ;
          if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
            for (let y = 18; y <= 21; y++) {
              chunk.setBlock(lx, y, lz, BLOCKS.TETRAPOD);
            }
          }
        }
        continue;
      }

      // 2. Promenade Walkway (Paving & Kerb)
      if (props.highway === 'footway') {
        const width = props.width || 6;
        const cells = rasterizePolyline(feat.points, width);
        for (const cell of cells) {
          const lx = cell.x - originX;
          const lz = cell.z - originZ;
          if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
            chunk.setBlock(lx, 21, lz, BLOCKS.PAVING_GREY);
          }
        }
        continue;
      }

      // 3. Highways & Streets
      if (props.highway) {
        let width = 6;
        if (props.highway === 'motorway' || props.highway === 'primary') width = props.width || 14;
        else if (props.highway === 'secondary') width = 10;
        else if (props.highway === 'tertiary') width = 7;
        else width = 4;

        const cells = rasterizePolyline(feat.points, width);
        for (const cell of cells) {
          const lx = cell.x - originX;
          const lz = cell.z - originZ;
          if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
            // Road surface markings
            const isCenterLine = Math.abs(cell.x % 14) === 0;
            const isWhiteDashed = Math.abs(cell.x % 7) === 0 && Math.abs(cell.z % 4) < 2;

            if (isCenterLine && width >= 10) {
              chunk.setBlock(lx, 21, lz, BLOCKS.ASPHALT_LINE_YELLOW);
            } else if (isWhiteDashed && width >= 10) {
              chunk.setBlock(lx, 21, lz, BLOCKS.ASPHALT_LINE_WHITE);
            } else {
              chunk.setBlock(lx, 21, lz, BLOCKS.ASPHALT);
            }
          }
        }
        continue;
      }

      // 4. Railways
      if (props.railway === 'rail') {
        const cells = rasterizePolyline(feat.points, 4);
        for (const cell of cells) {
          const lx = cell.x - originX;
          const lz = cell.z - originZ;
          if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
            chunk.setBlock(lx, 21, lz, BLOCKS.RAIL_BALLAST);
          }
        }
      }
    }
  }

  rasterizePolygons(chunk, originX, originZ) {
    for (const feat of this.projectedFeatures) {
      if (feat.type !== 'polygon') continue;
      const props = feat.properties || {};

      // 1. Parks & Gardens
      if (props.leisure === 'park' || props.natural === 'wood') {
        const cells = rasterizePolygon(feat.exterior, feat.interiors);
        for (const cell of cells) {
          const lx = cell.x - originX;
          const lz = cell.z - originZ;
          if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
            chunk.setBlock(lx, 21, lz, BLOCKS.GRASS);
            // Occasional palm / banyan trees
            if ((cell.x * 17 + cell.z * 31) % 43 === 0) {
              this.stampTree(chunk, lx, 22, lz, BLOCKS.LEAVES_BANYAN);
            }
          }
        }
        continue;
      }

      // 2. Buildings & Monuments
      if (props.building || props.historic === 'monument') {
        // First check if it matches a hand-authored landmark
        // Center coordinate of exterior ring
        let sumX = 0, sumZ = 0;
        for (const pt of feat.exterior) {
          sumX += pt[0];
          sumZ += pt[1];
        }
        const centerX = sumX / feat.exterior.length;
        const centerZ = sumZ / feat.exterior.length;

        const isLandmark = LandmarkRegistry.tryStampLandmark(
          chunk,
          originX,
          originZ,
          props,
          centerX,
          centerZ
        );

        if (isLandmark) continue;

        // Generic Building Rasterization with True Perimeter Solid Walls
        const cells = rasterizePolygon(feat.exterior, feat.interiors);
        if (cells.length === 0) continue;

        // Determine height
        let heightMeters = 20;
        if (props.height) {
          heightMeters = parseFloat(props.height);
        } else if (props['building:levels']) {
          heightMeters = parseInt(props['building:levels'], 10) * 3.5;
        } else {
          if (this.preset.districtStyle === 'glass_towers') heightMeters = 55;
          else if (this.preset.districtStyle === 'chawl') heightMeters = 10;
          else if (this.preset.districtStyle === 'gothic') heightMeters = 28;
          else heightMeters = 22; // Art Deco default
        }

        const topY = Math.min(126, Math.round(21 + heightMeters));

        // Determine wall, window, and roof materials
        let wallBlock = BLOCKS.WHITEWASH_ART_DECO;
        let accentBlock = BLOCKS.GLASS;
        let roofBlock = BLOCKS.CONCRETE_ROUGH;

        if (props['building:material'] === 'gothic_sandstone' || this.preset.districtStyle === 'gothic') {
          wallBlock = BLOCKS.GOTHIC_SANDSTONE;
          accentBlock = BLOCKS.GLASS;
        } else if (props['building:material'] === 'glass' || this.preset.districtStyle === 'glass_towers') {
          wallBlock = BLOCKS.GLASS;
          accentBlock = BLOCKS.GLASS_CLEAR;
        } else if (this.preset.districtStyle === 'chawl') {
          wallBlock = (props.name?.length % 2 === 0) ? BLOCKS.CHAWL_WALL_OCHRE : BLOCKS.CHAWL_WALL_BLUE;
          accentBlock = BLOCKS.TIN_ROOF_BLUE_TARP;
          roofBlock = BLOCKS.TIN_ROOF_CORRUGATED;
        }

        // True Perimeter Wall Detection: a cell is an exterior wall if any 4-neighbor is missing
        const cellSet = new Set(cells.map(c => `${c.x},${c.z}`));

        for (const cell of cells) {
          const lx = cell.x - originX;
          const lz = cell.z - originZ;
          if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
            const isEdge = !cellSet.has(`${cell.x + 1},${cell.z}`) ||
                           !cellSet.has(`${cell.x - 1},${cell.z}`) ||
                           !cellSet.has(`${cell.x},${cell.z + 1}`) ||
                           !cellSet.has(`${cell.x},${cell.z - 1}`);

            for (let y = 21; y <= topY; y++) {
              if (y === topY) {
                // Rooftop
                if (isEdge) {
                  chunk.setBlock(lx, y, lz, BLOCKS.KERB); // Parapet
                } else if ((cell.x + cell.z) % 23 === 0) {
                  chunk.setBlock(lx, y, lz, BLOCKS.WATER_TANK); // Rooftop Sintex tank
                } else {
                  chunk.setBlock(lx, y, lz, roofBlock);
                }
              } else if (isEdge) {
                // Solid exterior wall with architectural window rhythm
                const isWindow = (y % 4 === 1 || y % 4 === 2) && (cell.x % 3 === 0 || cell.z % 3 === 0);
                chunk.setBlock(lx, y, lz, isWindow ? accentBlock : wallBlock);
              } else {
                // Interior floor slab on every 4th level, solid foundation on y=21
                if (y === 21 || y % 4 === 0) {
                  chunk.setBlock(lx, y, lz, BLOCKS.CONCRETE_ROUGH);
                }
              }
            }
          }
        }
      }
    }
  }

  addAmbientProps(chunk, originX, originZ) {
    // Street lanterns and vehicles on roads
    if (Math.abs(chunk.cx * 7 + chunk.cz * 13) % 9 === 0) {
      for (let lz = 2; lz < 6; lz++) {
        for (let lx = 4; lx < 7; lx++) {
          if (chunk.getBlock(lx, 21, lz) === BLOCKS.ASPHALT) {
            // Kaali-Peeli taxi body
            chunk.setBlock(lx, 22, lz, BLOCKS.TAXI_BODY);
          }
        }
      }
    }
  }

  stampTree(chunk, lx, baseY, lz, leafBlock) {
    if (lx < 1 || lx >= CHUNK_SIZE_X - 1 || lz < 1 || lz >= CHUNK_SIZE_Z - 1) return;
    for (let y = baseY; y < baseY + 4; y++) {
      chunk.setBlock(lx, y, lz, BLOCKS.WOOD_LOG_TREE);
    }
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        chunk.setBlock(lx + dx, baseY + 4, lz + dz, leafBlock);
      }
    }
  }
}
