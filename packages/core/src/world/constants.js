/**
 * Voxel Mumbai - World Constants & Coordinate Utilities
 */

export const CHUNK_SIZE_X = 16;
export const CHUNK_SIZE_Z = 16;
export const CHUNK_SIZE_Y = 128;
export const CHUNK_VOXEL_COUNT = CHUNK_SIZE_X * CHUNK_SIZE_Y * CHUNK_SIZE_Z; // 32,768 voxels

export const SEA_LEVEL = 20; // 20m above chunk floor
export const METERS_PER_BLOCK = 1.0;

/**
 * Returns index inside chunk Uint16Array for local coordinates (x, y, z).
 * Local ranges: x in [0..15], y in [0..127], z in [0..15]
 */
export function voxelIndex(x, y, z) {
  return (y << 8) | (z << 4) | x;
}

/**
 * Creates unique string key for chunk coordinates (cx, cz)
 */
export function chunkKey(cx, cz) {
  return `${cx},${cz}`;
}

/**
 * Parses chunk key back to [cx, cz]
 */
export function parseChunkKey(key) {
  const parts = key.split(',');
  return [parseInt(parts[0], 10), parseInt(parts[1], 10)];
}

/**
 * Converts world block coordinates (wx, wz) to chunk coordinates (cx, cz)
 */
export function worldToChunk(wx, wz) {
  return {
    cx: Math.floor(wx / CHUNK_SIZE_X),
    cz: Math.floor(wz / CHUNK_SIZE_Z)
  };
}

/**
 * Converts world block coordinates (wx, wz) to local coordinates inside chunk (lx, lz)
 */
export function worldToLocal(wx, wz) {
  return {
    lx: ((wx % CHUNK_SIZE_X) + CHUNK_SIZE_X) % CHUNK_SIZE_X,
    lz: ((wz % CHUNK_SIZE_Z) + CHUNK_SIZE_Z) % CHUNK_SIZE_Z
  };
}
