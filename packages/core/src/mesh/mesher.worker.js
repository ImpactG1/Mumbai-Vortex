/**
 * Voxel Mumbai - Mesher Web Worker
 * Runs greedy meshing asynchronously off the main thread.
 */

import { meshChunk } from './greedy-mesher.js';

self.onmessage = function (e) {
  const { id, cx, cz, chunkVoxels, neighbors, uvMap } = e.data;

  const result = meshChunk(chunkVoxels, neighbors, uvMap);

  // Collect transferable ArrayBuffers
  const transferables = [];
  for (const pass of ['opaque', 'cutout', 'transparent']) {
    const buf = result[pass];
    if (buf && buf.positions && buf.positions.buffer) {
      transferables.push(
        buf.positions.buffer,
        buf.normals.buffer,
        buf.uvs.buffer,
        buf.colors.buffer,
        buf.indices.buffer
      );
    }
  }

  self.postMessage(
    {
      id,
      cx,
      cz,
      result
    },
    transferables
  );
};
