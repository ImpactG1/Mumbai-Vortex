/**
 * Voxel Mumbai - Phase 1 Test World Generator
 * Generates an expansive 20x20 chunk test arena with varied terrain,
 * roads, sea coastline, tetrapods, Art Deco facades, chawls, and Mumbai vehicles.
 */

import { BLOCKS } from './block-registry.js';
import { CHUNK_SIZE_X, CHUNK_SIZE_Y, CHUNK_SIZE_Z } from './constants.js';

export function generateTestChunk(chunk) {
  const cx = chunk.cx;
  const cz = chunk.cz;

  const originX = cx * CHUNK_SIZE_X;
  const originZ = cz * CHUNK_SIZE_Z;

  for (let lz = 0; lz < CHUNK_SIZE_Z; lz++) {
    for (let lx = 0; lx < CHUNK_SIZE_X; lx++) {
      const wx = originX + lx;
      const wz = originZ + lz;

      // Bedrock
      chunk.setBlock(lx, 0, lz, BLOCKS.BASALT);

      // Subsurface geology (Laterite & Stone)
      for (let y = 1; y < 18; y++) {
        if (y < 8) {
          chunk.setBlock(lx, y, lz, BLOCKS.STONE);
        } else {
          chunk.setBlock(lx, y, lz, BLOCKS.LATERITE);
        }
      }

      // Soil layer
      chunk.setBlock(lx, 18, lz, BLOCKS.DIRT);
      chunk.setBlock(lx, 19, lz, BLOCKS.DIRT);

      // Coastline logic: Western side (wx < -60) is the Arabian Sea!
      if (wx < -60) {
        // Deep sea
        for (let y = 1; y <= 20; y++) {
          chunk.setBlock(lx, y, lz, BLOCKS.SEA_WATER);
        }
        continue;
      }

      // Marine Drive Promenade & Tetrapod Breakwater (-60 <= wx <= -52)
      if (wx >= -60 && wx <= -57) {
        // Tetrapod breakwater
        for (let y = 18; y <= 21; y++) {
          chunk.setBlock(lx, y, lz, BLOCKS.TETRAPOD);
        }
        continue;
      }

      if (wx >= -56 && wx <= -50) {
        // Promenade walkway
        for (let y = 1; y <= 21; y++) {
          chunk.setBlock(lx, y, lz, BLOCKS.PAVING_GREY);
        }
        // Promenade sea wall railing at wx == -56
        if (wx === -56) {
          chunk.setBlock(lx, 22, lz, BLOCKS.KERB);
        }
        continue;
      }

      // Coastal Highway (Netaji Subhash Chandra Bose Road / Marine Drive)
      // wx between -48 and -32 (16 blocks wide)
      if (wx >= -48 && wx <= -32) {
        for (let y = 1; y <= 21; y++) {
          chunk.setBlock(lx, y, lz, BLOCKS.DIRT);
        }
        // Road surface
        if (wx === -40) {
          chunk.setBlock(lx, 21, lz, BLOCKS.ASPHALT_LINE_YELLOW);
        } else if (wx === -44 || wx === -36) {
          chunk.setBlock(lx, 21, lz, (Math.floor(wz / 4) % 2 === 0) ? BLOCKS.ASPHALT_LINE_WHITE : BLOCKS.ASPHALT);
        } else if (wz % 40 === 0) {
          chunk.setBlock(lx, 21, lz, BLOCKS.ASPHALT_ZEBRA);
        } else {
          chunk.setBlock(lx, 21, lz, BLOCKS.ASPHALT);
        }
        continue;
      }

      // Footpath on east side of highway (-31 to -28)
      if (wx >= -31 && wx <= -28) {
        chunk.setBlock(lx, 21, lz, BLOCKS.PAVING_GREY);
        continue;
      }

      // Railway line at wx between 60 and 72
      if (wx >= 60 && wx <= 72) {
        if (wx === 64 || wx === 68) {
          // Steel track & sleepers
          chunk.setBlock(lx, 21, lz, BLOCKS.RAIL_BALLAST);
        } else if (wx === 72) {
          // Platform
          chunk.setBlock(lx, 21, lz, BLOCKS.RAIL_PLATFORM);
          chunk.setBlock(lx, 22, lz, BLOCKS.RAIL_PLATFORM);
        } else {
          chunk.setBlock(lx, 21, lz, BLOCKS.GRAVEL);
        }
        continue;
      }

      // General City Ground: Grass by default
      chunk.setBlock(lx, 20, lz, BLOCKS.GRASS);

      // Periodic Grid Roads
      const isEastWestRoad = (Math.abs(wz) % 48 < 6);
      const isNorthSouthRoad = (Math.abs(wx) % 48 < 6 && wx > -25);
      if (isEastWestRoad || isNorthSouthRoad) {
        chunk.setBlock(lx, 20, lz, BLOCKS.ASPHALT);
        continue;
      }
    }
  }

  // Stamp architectural test buildings, vehicles, and props inside city blocks
  stampPropsAndBuildings(chunk, originX, originZ);

  chunk.dirty = true;
}

function stampPropsAndBuildings(chunk, originX, originZ) {
  // Art Deco Building block at (-20, 20)
  stampBuilding(chunk, originX, originZ, -24, 8, 14, 18, 38, BLOCKS.WHITEWASH_ART_DECO, BLOCKS.GLASS);

  // Gothic / CSMT style building at (10, -20)
  stampBuilding(chunk, originX, originZ, 8, -26, 16, 20, 42, BLOCKS.GOTHIC_SANDSTONE, BLOCKS.STONE_BRICK);

  // Chawl settlement at (20, 30) with tin roofs & blue tarps
  stampChawl(chunk, originX, originZ, 16, 26, 18, 16, 29);

  // Vehicles on roads
  stampVehicle(chunk, originX, originZ, -42, 12, BLOCKS.TAXI_BODY); // Kaali Peeli Taxi
  stampVehicle(chunk, originX, originZ, -36, -20, BLOCKS.BEST_BUS, 6); // Red BEST bus
  stampVehicle(chunk, originX, originZ, -46, 32, BLOCKS.AUTO_RICKSHAW); // Auto
  stampTrain(chunk, originX, originZ, 64, 0); // Mumbai Local coach on track

  // Trees along footpath
  for (let z = -80; z < 80; z += 16) {
    stampPalmTree(chunk, originX, originZ, -29, z);
    stampGulmoharTree(chunk, originX, originZ, -53, z);
  }
}

function stampBuilding(chunk, originX, originZ, bx, bz, bw, bd, bh, wallBlock, accentBlock) {
  for (let y = 21; y <= bh; y++) {
    for (let z = bz; z < bz + bd; z++) {
      for (let x = bx; x < bx + bw; x++) {
        const lx = x - originX;
        const lz = z - originZ;
        if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
          const isEdge = (x === bx || x === bx + bw - 1 || z === bz || z === bz + bd - 1);
          const isRoof = (y === bh);

          if (isRoof) {
            // Parapet and roof slab
            if (isEdge) {
              chunk.setBlock(lx, y, lz, BLOCKS.KERB);
            } else if (x === bx + 3 && z === bz + 3) {
              chunk.setBlock(lx, y, lz, BLOCKS.WATER_TANK);
            } else {
              chunk.setBlock(lx, y, lz, BLOCKS.CONCRETE_ROUGH);
            }
          } else if (isEdge) {
            // Window rhythm: windows on every 3rd block
            const isWindow = (y % 4 === 1 || y % 4 === 2) && (x % 3 === 0 || z % 3 === 0);
            if (isWindow) {
              chunk.setBlock(lx, y, lz, accentBlock);
            } else {
              chunk.setBlock(lx, y, lz, wallBlock);
            }
          }
        }
      }
    }
  }
}

function stampChawl(chunk, originX, originZ, bx, bz, bw, bd, bh) {
  for (let y = 21; y <= bh; y++) {
    for (let z = bz; z < bz + bd; z++) {
      for (let x = bx; x < bx + bw; x++) {
        const lx = x - originX;
        const lz = z - originZ;
        if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
          const isEdge = (x === bx || x === bx + bw - 1 || z === bz || z === bz + bd - 1);
          const isRoof = (y === bh);

          if (isRoof) {
            // Blue tarp and tin roof variation
            const roofBlock = ((x + z) % 3 === 0) ? BLOCKS.TIN_ROOF_BLUE_TARP : BLOCKS.TIN_ROOF_CORRUGATED;
            chunk.setBlock(lx, y, lz, roofBlock);
          } else if (isEdge) {
            const wallBlock = ((x + y) % 2 === 0) ? BLOCKS.CHAWL_WALL_OCHRE : BLOCKS.CHAWL_WALL_BLUE;
            chunk.setBlock(lx, y, lz, wallBlock);
          }
        }
      }
    }
  }
}

function stampVehicle(chunk, originX, originZ, vx, vz, vehicleBlock, length = 3) {
  for (let dz = 0; dz < length; dz++) {
    const lx = vx - originX;
    const lz = vz + dz - originZ;
    if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
      chunk.setBlock(lx, 22, lz, vehicleBlock);
      if (length >= 5) {
        chunk.setBlock(lx, 23, lz, vehicleBlock); // Double decker height
      }
    }
  }
}

function stampTrain(chunk, originX, originZ, tx, tz) {
  for (let dz = 0; dz < 18; dz++) {
    const lx = tx - originX;
    const lz = tz + dz - originZ;
    if (lx >= 0 && lx < CHUNK_SIZE_X && lz >= 0 && lz < CHUNK_SIZE_Z) {
      chunk.setBlock(lx, 22, lz, BLOCKS.LOCAL_TRAIN);
      chunk.setBlock(lx, 23, lz, BLOCKS.LOCAL_TRAIN);
    }
  }
}

function stampPalmTree(chunk, originX, originZ, px, pz) {
  const lx = px - originX;
  const lz = pz - originZ;
  if (lx < 0 || lx >= CHUNK_SIZE_X || lz < 0 || lz >= CHUNK_SIZE_Z) return;

  // Trunk height 7
  for (let y = 21; y <= 27; y++) {
    chunk.setBlock(lx, y, lz, BLOCKS.WOOD_LOG_PALM);
  }

  // Fronds on top
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const flx = lx + dx;
      const flz = lz + dz;
      if (flx >= 0 && flx < CHUNK_SIZE_X && flz >= 0 && flz < CHUNK_SIZE_Z) {
        chunk.setBlock(flx, 28, flz, BLOCKS.LEAVES_PALM);
      }
    }
  }
}

function stampGulmoharTree(chunk, originX, originZ, gx, gz) {
  const lx = gx - originX;
  const lz = gz - originZ;
  if (lx < 0 || lx >= CHUNK_SIZE_X || lz < 0 || lz >= CHUNK_SIZE_Z) return;

  for (let y = 21; y <= 24; y++) {
    chunk.setBlock(lx, y, lz, BLOCKS.WOOD_LOG_TREE);
  }

  // Red flower crown
  for (let dy = 24; dy <= 26; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        const glx = lx + dx;
        const glz = lz + dz;
        if (glx >= 0 && glx < CHUNK_SIZE_X && glz >= 0 && glz < CHUNK_SIZE_Z) {
          if (Math.abs(dx) + Math.abs(dz) <= 3) {
            chunk.setBlock(glx, dy, glz, BLOCKS.LEAVES_GULMOHAR);
          }
        }
      }
    }
  }
}
