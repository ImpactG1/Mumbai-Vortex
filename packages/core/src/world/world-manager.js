/**
 * Voxel Mumbai - World Manager
 * Coordinates real OpenStreetMap data fetching, elevation sampling,
 * voxelization, chunk streaming, meshing worker scheduling, and camera navigation.
 */

import { ChunkStore } from './chunk-store.js';
import { WorldRenderer } from '../render/world-renderer.js';
import { MesherClient } from '../mesh/mesher-client.js';
import { FlyingCamera } from '../camera/flying-camera.js';
import { OsmFetcher } from '../gen/osm-fetcher.js';
import { OsmVoxelizer } from '../gen/osm-voxelizer.js';
import { EquirectangularProjection } from '../gen/projection.js';
import { ElevationSampler } from '../gen/elevation.js';
import { PRESETS, getPresetById } from '../gen/presets.js';
import { worldToChunk, chunkKey } from './constants.js';

export class WorldManager {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {import('../input/input-adapter.js').InputAdapter} inputAdapter
   * @param {Object} [options]
   */
  constructor(canvas, inputAdapter, options = {}) {
    this.canvas = canvas;
    this.input = inputAdapter;
    this.renderDistance = options.renderDistance || 8;

    // 1. Core subsystems
    this.renderer = new WorldRenderer(canvas, { renderDistance: this.renderDistance });
    this.chunkStore = new ChunkStore();
    this.mesherClient = new MesherClient(this.renderer.atlas.exportUVMap());
    this.osmFetcher = new OsmFetcher();

    // 2. Active geographic state
    this.activePreset = getPresetById(options.presetId || 'marine_drive');
    this.projection = new EquirectangularProjection(this.activePreset.lat, this.activePreset.lon);
    this.elevationSampler = new ElevationSampler({ verticalExaggeration: 2.0 });
    this.voxelizer = null;

    // 3. Camera & Player
    this.camera = new FlyingCamera(this.renderer.camera, this.input, {
      x: this.activePreset.spawn.x,
      y: this.activePreset.spawn.y,
      z: this.activePreset.spawn.z,
      yaw: this.activePreset.spawn.yaw,
      pitch: this.activePreset.spawn.pitch,
      speed: 26.0
    });

    // 4. Engine loop state
    this.isRunning = false;
    this.lastTime = performance.now();
    this.fps = 60;
    this.frameCount = 0;
    this.fpsTimer = 0;
    this.activeMeshingCount = 0;
    this.totalQuads = 0;

    this.onStatsCallback = null;
    this.onLoadingStep = null;
    this.boundLoop = this.loop.bind(this);
  }

  /**
   * Loads and switches to a Mumbai location preset
   * @param {string} presetId
   */
  async loadLocation(presetId) {
    const preset = getPresetById(presetId);
    this.activePreset = preset;

    if (this.onLoadingStep) this.onLoadingStep('Connecting to OpenStreetMap...', preset.fact);

    // 1. Reset world chunks
    this.chunkStore.clear();
    this.totalQuads = 0;

    // 2. Set projection & elevation
    this.projection = new EquirectangularProjection(preset.lat, preset.lon);
    const bbox = this.projection.getBoundingBox(preset.radius);

    if (this.onLoadingStep) this.onLoadingStep('Fetching building footprints & roads...', preset.fact);

    // 3. Fetch OSM GeoJSON
    const geoJson = await this.osmFetcher.fetchTile(preset.id, bbox);

    if (this.onLoadingStep) this.onLoadingStep('Raising Mumbai architecture & sea...', preset.fact);

    // 4. Instantiate Voxelizer
    this.voxelizer = new OsmVoxelizer(geoJson, this.projection, this.elevationSampler, preset);

    // 5. Reset camera to preset spawn point
    this.camera.setPosition(preset.spawn.x, preset.spawn.y, preset.spawn.z);
    this.camera.setRotation(preset.spawn.yaw, preset.spawn.pitch);

    // 6. Pre-generate and stream initial chunks around spawn
    this.updateStreaming();

    if (this.onLoadingStep) this.onLoadingStep(null); // Finished loading
  }

  /**
   * Starts the simulation and render loop
   */
  async start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    // Load initial preset
    await this.loadLocation(this.activePreset.id);
    requestAnimationFrame(this.boundLoop);
  }

  stop() {
    this.isRunning = false;
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    // FPS calculation
    this.frameCount++;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 0.5) {
      this.fps = Math.round(this.frameCount / this.fpsTimer);
      this.frameCount = 0;
      this.fpsTimer = 0;
      if (this.onStatsCallback) {
        // Calculate real lat/lon for current camera position
        const { lat, lon } = this.projection.unproject(this.camera.position.x, this.camera.position.z);
        this.onStatsCallback({
          fps: this.fps,
          chunkCount: this.chunkStore.chunks.size,
          quadCount: this.totalQuads,
          cameraPos: this.camera.position,
          lat,
          lon,
          preset: this.activePreset,
          activeMeshing: this.activeMeshingCount
        });
      }
    }

    // 1. Update Camera
    this.camera.update(dt);

    // 2. Stream and update chunks around player
    this.updateStreaming();

    // 3. Update Atmosphere & Weather
    this.renderer.update(dt);

    // 4. Render frame
    this.renderer.render();

    requestAnimationFrame(this.boundLoop);
  }

  updateStreaming() {
    if (!this.voxelizer) return;

    const playerPos = this.camera.position;
    const { cx: playerCx, cz: playerCz } = worldToChunk(playerPos.x, playerPos.z);
    const r = this.renderDistance;

    const neededChunks = [];
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        const distSq = dx * dx + dz * dz;
        if (distSq <= (r + 0.5) * (r + 0.5)) {
          neededChunks.push({
            cx: playerCx + dx,
            cz: playerCz + dz,
            distSq
          });
        }
      }
    }

    neededChunks.sort((a, b) => a.distSq - b.distSq);

    let dispatchedThisFrame = 0;
    const MAX_DISPATCH_PER_FRAME = 6;

    for (const item of neededChunks) {
      const { cx, cz, distSq } = item;
      let chunk = this.chunkStore.getChunk(cx, cz);

      // Generate chunk with OSM Voxelizer
      if (!chunk) {
        chunk = this.chunkStore.getOrCreateChunk(cx, cz);
        this.voxelizer.voxelizeChunk(chunk);
      }

      // Schedule meshing
      if (chunk.dirty && !chunk.isMeshing && dispatchedThisFrame < MAX_DISPATCH_PER_FRAME) {
        chunk.isMeshing = true;
        this.activeMeshingCount++;
        dispatchedThisFrame++;

        const px = this.chunkStore.getChunk(cx + 1, cz)?.voxels || null;
        const nx = this.chunkStore.getChunk(cx - 1, cz)?.voxels || null;
        const pz = this.chunkStore.getChunk(cx, cz + 1)?.voxels || null;
        const nz = this.chunkStore.getChunk(cx, cz - 1)?.voxels || null;

        this.mesherClient.scheduleChunk(cx, cz, chunk.voxels, { px, nx, pz, nz }, distSq)
          .then((meshData) => {
            chunk.isMeshing = false;
            chunk.dirty = false;
            this.activeMeshingCount = Math.max(0, this.activeMeshingCount - 1);
            this.renderer.updateChunkMesh(chunk, meshData);
            this.totalQuads += meshData.quadCount;
          })
          .catch((err) => {
            chunk.isMeshing = false;
            this.activeMeshingCount = Math.max(0, this.activeMeshingCount - 1);
            console.error(`Meshing error for chunk (${cx}, ${cz}):`, err);
          });
      }
    }

    // Unload chunks beyond (renderDistance + 2)
    const unloadDistSq = (r + 2) * (r + 2);
    for (const chunk of this.chunkStore.chunks.values()) {
      const dx = chunk.cx - playerCx;
      const dz = chunk.cz - playerCz;
      if (dx * dx + dz * dz > unloadDistSq) {
        this.chunkStore.unloadChunk(chunk.cx, chunk.cz);
      }
    }
  }

  destroy() {
    this.stop();
    this.mesherClient.destroy();
    this.renderer.destroy();
    this.chunkStore.clear();
  }
}
