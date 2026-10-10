import { describe, it, expect } from 'vitest';
import { meshChunk } from '../packages/core/src/mesh/greedy-mesher.js';
import { TextureAtlas } from '../packages/core/src/render/atlas-generator.js';
import { BLOCKS } from '../packages/core/src/world/block-registry.js';
import { CHUNK_VOXEL_COUNT, voxelIndex } from '../packages/core/src/world/constants.js';

describe('Voxel Mesher', () => {
  const atlas = new TextureAtlas();
  const uvMap = atlas.exportUVMap();

  it('meshes a single isolated solid voxel with exactly 6 quads', () => {
    const voxels = new Uint16Array(CHUNK_VOXEL_COUNT);
    voxels[voxelIndex(5, 5, 5)] = BLOCKS.STONE;

    const result = meshChunk(voxels, null, uvMap);

    expect(result.quadCount).toBe(6);
    expect(result.opaque.vertexCount).toBe(24);
    expect(result.opaque.indices.length).toBe(36); // 6 quads * 6 indices
  });

  it('culls interior shared faces between two adjacent blocks', () => {
    const voxels = new Uint16Array(CHUNK_VOXEL_COUNT);
    voxels[voxelIndex(5, 5, 5)] = BLOCKS.STONE;
    voxels[voxelIndex(6, 5, 5)] = BLOCKS.STONE;

    const result = meshChunk(voxels, null, uvMap);

    // Two 1x1 blocks have 12 faces, but the 2 touching faces (+X of first, -X of second) are hidden.
    // So exactly 10 exposed faces are generated.
    expect(result.quadCount).toBe(10);
  });

  it('ensures all quad UVs stay strictly bounded inside their assigned tile (zero bleed/stretching)', () => {
    const voxels = new Uint16Array(CHUNK_VOXEL_COUNT);
    voxels[voxelIndex(2, 2, 2)] = BLOCKS.TAXI_BODY;
    voxels[voxelIndex(3, 2, 2)] = BLOCKS.WHITEWASH_ART_DECO;

    const result = meshChunk(voxels, null, uvMap);
    const uvs = result.opaque.uvs;

    expect(uvs.length).toBeGreaterThan(0);
    for (let i = 0; i < uvs.length; i += 2) {
      const u = uvs[i];
      const v = uvs[i + 1];
      expect(u).toBeGreaterThanOrEqual(0.0);
      expect(u).toBeLessThanOrEqual(1.0);
      expect(v).toBeGreaterThanOrEqual(0.0);
      expect(v).toBeLessThanOrEqual(1.0);
    }
  });
});
