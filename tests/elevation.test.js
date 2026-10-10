import { describe, it, expect } from 'vitest';
import { decodeTerrariumRGB, ElevationSampler } from '../packages/core/src/gen/elevation.js';

describe('Terrarium Elevation Decoder', () => {
  it('decodes sea level (0m elevation) correctly', () => {
    // 0 = (R * 256 + G + B / 256) - 32768
    // When R = 128, G = 0, B = 0: (128 * 256 + 0 + 0) - 32768 = 32768 - 32768 = 0.0
    const elev = decodeTerrariumRGB(128, 0, 0);
    expect(elev).toBe(0.0);
  });

  it('decodes positive elevations accurately', () => {
    // For 100 metres:
    // 32768 + 100 = 32868
    // R = Math.floor(32868 / 256) = 128
    // G = 32868 - (128 * 256) = 100
    // B = 0
    const elev = decodeTerrariumRGB(128, 100, 0);
    expect(elev).toBe(100.0);
  });

  it('clamps sea coordinates to SEA_LEVEL (y = 20)', () => {
    const sampler = new ElevationSampler();
    const seaY = sampler.sampleHeight(-100, 50, true);
    expect(seaY).toBe(20);
  });

  it('elevates land above sea level with vertical exaggeration', () => {
    const sampler = new ElevationSampler({ verticalExaggeration: 2.0 });
    const landY = sampler.sampleHeight(0, 0, false);
    expect(landY).toBeGreaterThanOrEqual(21);
  });
});
