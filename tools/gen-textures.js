/**
 * Voxel Mumbai - Procedural Texture Generator Tool
 * Node CLI / standalone runner for procedural texture generation and verification.
 */

import { TextureAtlas } from '../packages/core/src/render/atlas-generator.js';

console.log('Generating Voxel Mumbai procedural texture atlas...');
const startTime = performance.now();
const atlas = new TextureAtlas();
const elapsed = (performance.now() - startTime).toFixed(2);

console.log(`Atlas generated successfully in ${elapsed} ms.`);
console.log(`Atlas Dimensions: ${atlas.width}x${atlas.height} px (${atlas.tileSize}x${atlas.tileSize} px per tile)`);
console.log(`Total packed tiles: ${atlas.uvMap.size}`);

// Print a few sample tiles and their UVs
const sampleTiles = ['grass_top', 'sea_water', 'whitewash_art_deco', 'taxi_side', 'tetrapod', 'gothic_sandstone'];
console.log('\nSample UV Coordinates:');
for (const tile of sampleTiles) {
  const uv = atlas.getUV(tile);
  console.log(` - ${tile.padEnd(20)}: u=[${uv.u0.toFixed(4)}, ${uv.u1.toFixed(4)}], v=[${uv.v0.toFixed(4)}, ${uv.v1.toFixed(4)}]`);
}
