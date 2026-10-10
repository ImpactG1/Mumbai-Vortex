import { describe, it, expect } from 'vitest';
import { BLOCKS, BLOCK_DEFS, getFaceTextureName, getBlockRenderPass } from '../packages/core/src/world/block-registry.js';
import { TextureAtlas } from '../packages/core/src/render/atlas-generator.js';

describe('Block Registry & Atlas Compatibility', () => {
  const atlas = new TextureAtlas();

  it('verifies all registered block IDs have definitions', () => {
    for (const [name, id] of Object.entries(BLOCKS)) {
      expect(BLOCK_DEFS[id], `Missing block definition for ${name} (id: ${id})`).toBeDefined();
    }
  });

  it('ensures all block face textures exist in the atlas generator', () => {
    for (const [name, id] of Object.entries(BLOCKS)) {
      if (id === BLOCKS.AIR) continue;
      for (const face of ['top', 'bottom', 'north', 'south', 'east', 'west']) {
        const texName = getFaceTextureName(id, face);
        expect(texName, `Face texture for ${name} on face ${face} was missing`).not.toBe('missing');
        const uv = atlas.getUV(texName);
        expect(uv, `Atlas UV missing for texture ${texName}`).toBeDefined();
        expect(uv.u0).toBeGreaterThanOrEqual(0);
        expect(uv.u1).toBeLessThanOrEqual(1);
      }
    }
  });

  it('classifies render passes correctly', () => {
    expect(getBlockRenderPass(BLOCKS.AIR)).toBe('air');
    expect(getBlockRenderPass(BLOCKS.STONE)).toBe('opaque');
    expect(getBlockRenderPass(BLOCKS.WHITEWASH_ART_DECO)).toBe('opaque');
    expect(getBlockRenderPass(BLOCKS.LEAVES_BANYAN)).toBe('cutout');
    expect(getBlockRenderPass(BLOCKS.WATER)).toBe('transparent');
    expect(getBlockRenderPass(BLOCKS.SEA_WATER)).toBe('transparent');
  });
});
