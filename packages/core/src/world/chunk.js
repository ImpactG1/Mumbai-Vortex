/**
 * Voxel Mumbai - Chunk Data Structure
 * Encapsulates a 16 x 128 x 16 column of voxels stored in a Uint16Array.
 */

import { CHUNK_SIZE_X, CHUNK_SIZE_Y, CHUNK_SIZE_Z, CHUNK_VOXEL_COUNT, voxelIndex } from './constants.js';
import { BLOCKS } from './block-registry.js';

export class Chunk {
  /**
   * @param {number} cx
   * @param {number} cz
   * @param {Uint16Array} [existingVoxels]
   */
  constructor(cx, cz, existingVoxels = null) {
    this.cx = cx;
    this.cz = cz;
    this.key = `${cx},${cz}`;
    this.voxels = existingVoxels || new Uint16Array(CHUNK_VOXEL_COUNT);
    this.dirty = true;
    this.mesh = null;
    this.isMeshing = false;
    this.nonAirCount = 0;
    if (existingVoxels) {
      for (let i = 0; i < CHUNK_VOXEL_COUNT; i++) {
        if (this.voxels[i] !== BLOCKS.AIR) this.nonAirCount++;
      }
    }
  }

  /**
   * Gets block ID at local chunk coordinates (lx, ly, lz)
   * @param {number} lx
   * @param {number} ly
   * @param {number} lz
   * @returns {number}
   */
  getBlock(lx, ly, lz) {
    if (lx < 0 || lx >= CHUNK_SIZE_X || ly < 0 || ly >= CHUNK_SIZE_Y || lz < 0 || lz >= CHUNK_SIZE_Z) {
      return BLOCKS.AIR;
    }
    return this.voxels[voxelIndex(lx, ly, lz)];
  }

  /**
   * Sets block ID at local chunk coordinates (lx, ly, lz)
   * @param {number} lx
   * @param {number} ly
   * @param {number} lz
   * @param {number} blockId
   * @returns {boolean} whether the block was actually changed
   */
  setBlock(lx, ly, lz, blockId) {
    if (lx < 0 || lx >= CHUNK_SIZE_X || ly < 0 || ly >= CHUNK_SIZE_Y || lz < 0 || lz >= CHUNK_SIZE_Z) {
      return false;
    }
    const idx = voxelIndex(lx, ly, lz);
    const oldId = this.voxels[idx];
    if (oldId === blockId) return false;

    if (oldId === BLOCKS.AIR && blockId !== BLOCKS.AIR) {
      this.nonAirCount++;
    } else if (oldId !== BLOCKS.AIR && blockId === BLOCKS.AIR) {
      this.nonAirCount = Math.max(0, this.nonAirCount - 1);
    }

    this.voxels[idx] = blockId;
    this.dirty = true;
    return true;
  }

  isEmpty() {
    return this.nonAirCount === 0;
  }

  /**
   * Returns a clone of voxels Uint16Array for transfer to workers
   * @returns {Uint16Array}
   */
  cloneVoxels() {
    const copy = new Uint16Array(CHUNK_VOXEL_COUNT);
    copy.set(this.voxels);
    return copy;
  }

  /**
   * Disposes of any GPU meshes associated with this chunk
   */
  disposeMesh() {
    if (this.mesh) {
      if (this.mesh.parent) {
        this.mesh.parent.remove(this.mesh);
      }
      this.mesh.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
      });
      this.mesh = null;
    }
  }
}
