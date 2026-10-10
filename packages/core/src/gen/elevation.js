/**
 * Voxel Mumbai - Elevation Tile Decoder & Topographic Sampler
 * Supports Terrarium-format RGB elevation decoding and bilinear interpolation,
 * with vertical exaggeration and Mumbai topography fallback.
 */

import { SEA_LEVEL } from '../world/constants.js';

/**
 * Decodes Terrarium RGB pixel values to elevation in metres.
 * Formula: elevation = (R * 256 + G + B / 256) - 32768
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {number} elevation in metres
 */
export function decodeTerrariumRGB(r, g, b) {
  return (r * 256.0 + g + b / 256.0) - 32768.0;
}

export class ElevationSampler {
  /**
   * @param {Object} [options]
   */
  constructor(options = {}) {
    this.verticalExaggeration = options.verticalExaggeration || 2.0;
    this.tileData = null; // Uint8ClampedArray if tile loaded
    this.tileWidth = 256;
    this.tileHeight = 256;
  }

  /**
   * Samples terrain height at world coordinates (wx, wz).
   * Maps sea level to SEA_LEVEL (y = 20).
   * @param {number} wx
   * @param {number} wz
   * @param {boolean} isSea - whether land/sea mask classified this point as sea
   * @returns {number} block integer height y
   */
  sampleHeight(wx, wz, isSea = false) {
    if (isSea) {
      return SEA_LEVEL; // Sea floor or water surface
    }

    let rawElevation = 2.0; // Default coastal plain ~2m above sea level

    // If real elevation tile is loaded and parsed, do bilinear interpolation
    if (this.tileData) {
      rawElevation = this.sampleBilinear(wx, wz);
    } else {
      // Topographic fallback with gentle natural variation
      // Malabar Hill / ridge noise
      const d = Math.sqrt(wx * wx + wz * wz);
      const hillNoise = Math.sin(wx * 0.005) * Math.cos(wz * 0.005) * 6.0;
      const microNoise = Math.sin(wx * 0.02 + wz * 0.015) * 1.5;
      rawElevation = Math.max(1.0, 2.0 + hillNoise + microNoise);
    }

    // Apply vertical exaggeration
    const exaggerated = rawElevation * this.verticalExaggeration;
    // Base land height starts at SEA_LEVEL + 1 (y = 21)
    const blockHeight = Math.round(SEA_LEVEL + 1 + Math.max(0, exaggerated));
    return Math.min(120, Math.max(SEA_LEVEL, blockHeight));
  }

  sampleBilinear(u, v) {
    // Bilinear interpolation across tile pixel grid
    const px = Math.max(0, Math.min(this.tileWidth - 1, u));
    const py = Math.max(0, Math.min(this.tileHeight - 1, v));
    const x0 = Math.floor(px);
    const x1 = Math.min(this.tileWidth - 1, x0 + 1);
    const y0 = Math.floor(py);
    const y1 = Math.min(this.tileHeight - 1, y0 + 1);
    const fx = px - x0;
    const fy = py - y0;

    const getH = (x, y) => {
      const idx = (y * this.tileWidth + x) * 4;
      return decodeTerrariumRGB(this.tileData[idx], this.tileData[idx + 1], this.tileData[idx + 2]);
    };

    const h00 = getH(x0, y0);
    const h10 = getH(x1, y0);
    const h01 = getH(x0, y1);
    const h11 = getH(x1, y1);

    const h0 = h00 * (1 - fx) + h10 * fx;
    const h1 = h01 * (1 - fx) + h11 * fx;
    return h0 * (1 - fy) + h1 * fy;
  }
}
