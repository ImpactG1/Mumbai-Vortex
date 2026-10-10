/**
 * Voxel Mumbai - Chunk Store
 * Manages chunk instances, world-space coordinate access, delta player edits,
 * and chunk streaming lifecycle.
 */

import { Chunk } from './chunk.js';
import { BLOCKS } from './block-registry.js';
import { CHUNK_SIZE_X, CHUNK_SIZE_Y, CHUNK_SIZE_Z, worldToChunk, worldToLocal, chunkKey } from './constants.js';

export class ChunkStore {
  constructor() {
    /** @type {Map<string, Chunk>} */
    this.chunks = new Map();
    /**
     * Map of player edits keyed by chunkKey -> { voxelIdx: blockId }
     * Kept separate to allow delta persistence and quick export/import
     * @type {Map<string, Map<number, number>>}
     */
    this.edits = new Map();
    /** @type {Array<{x: number, y: number, z: number, blockId: number, time: number}>} */
    this.editHistory = [];
  }

  /**
   * Gets or creates a chunk at (cx, cz)
   * @param {number} cx
   * @param {number} cz
   * @returns {Chunk}
   */
  getOrCreateChunk(cx, cz) {
    const key = chunkKey(cx, cz);
    let chunk = this.chunks.get(key);
    if (!chunk) {
      chunk = new Chunk(cx, cz);
      this.chunks.set(key, chunk);
      // Apply any existing user edits for this chunk if loaded after edits
      const chunkEdits = this.edits.get(key);
      if (chunkEdits) {
        for (const [idx, blockId] of chunkEdits.entries()) {
          chunk.voxels[idx] = blockId;
        }
      }
    }
    return chunk;
  }

  /**
   * Retrieves chunk at (cx, cz), if loaded
   * @param {number} cx
   * @param {number} cz
   * @returns {Chunk|null}
   */
  getChunk(cx, cz) {
    return this.chunks.get(chunkKey(cx, cz)) || null;
  }

  /**
   * Checks if chunk is loaded
   * @param {number} cx
   * @param {number} cz
   * @returns {boolean}
   */
  hasChunk(cx, cz) {
    return this.chunks.has(chunkKey(cx, cz));
  }

  /**
   * Gets block ID at world block coordinates (wx, wy, wz)
   * @param {number} wx
   * @param {number} wy
   * @param {number} wz
   * @returns {number} blockId
   */
  getBlock(wx, wy, wz) {
    if (wy < 0 || wy >= CHUNK_SIZE_Y) return BLOCKS.AIR;
    const { cx, cz } = worldToChunk(wx, wz);
    const chunk = this.getChunk(cx, cz);
    if (!chunk) return BLOCKS.AIR;
    const { lx, lz } = worldToLocal(wx, wz);
    return chunk.getBlock(lx, wy, lz);
  }

  /**
   * Sets block ID at world block coordinates (wx, wy, wz), recording edit
   * @param {number} wx
   * @param {number} wy
   * @param {number} wz
   * @param {number} blockId
   * @param {boolean} [isPlayerEdit=true]
   * @returns {boolean}
   */
  setBlock(wx, wy, wz, blockId, isPlayerEdit = true) {
    if (wy < 0 || wy >= CHUNK_SIZE_Y) return false;
    const { cx, cz } = worldToChunk(wx, wz);
    const chunk = this.getOrCreateChunk(cx, cz);
    const { lx, lz } = worldToLocal(wx, wz);

    const changed = chunk.setBlock(lx, wy, lz, blockId);
    if (changed && isPlayerEdit) {
      const key = chunkKey(cx, cz);
      let chunkEdits = this.edits.get(key);
      if (!chunkEdits) {
        chunkEdits = new Map();
        this.edits.set(key, chunkEdits);
      }
      const idx = (wy << 8) | (lz << 4) | lx;
      chunkEdits.set(idx, blockId);

      this.editHistory.push({
        x: wx,
        y: wy,
        z: wz,
        blockId,
        time: Date.now()
      });

      // Mark neighbors dirty if on boundary
      if (lx === 0) this.markDirty(cx - 1, cz);
      if (lx === CHUNK_SIZE_X - 1) this.markDirty(cx + 1, cz);
      if (lz === 0) this.markDirty(cx, cz - 1);
      if (lz === CHUNK_SIZE_Z - 1) this.markDirty(cx, cz + 1);
    }
    return changed;
  }

  /**
   * Marks chunk dirty for remeshing
   */
  markDirty(cx, cz) {
    const chunk = this.getChunk(cx, cz);
    if (chunk) chunk.dirty = true;
  }

  /**
   * Unloads chunk and disposes its GPU resources
   * @param {number} cx
   * @param {number} cz
   */
  unloadChunk(cx, cz) {
    const key = chunkKey(cx, cz);
    const chunk = this.chunks.get(key);
    if (chunk) {
      chunk.disposeMesh();
      this.chunks.delete(key);
    }
  }

  /**
   * Clears all chunks
   */
  clear() {
    for (const chunk of this.chunks.values()) {
      chunk.disposeMesh();
    }
    this.chunks.clear();
    this.edits.clear();
    this.editHistory = [];
  }
}
