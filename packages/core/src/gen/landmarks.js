/**
 * Voxel Mumbai - Hand-Authored Landmark Models
 * Handcrafted architectural voxel stamps for iconic Mumbai monuments:
 * - Gateway of India (Basalt triumphal arch with 3 archways & central dome)
 * - Taj Mahal Palace Hotel (Sandstone facade with red domes & towers)
 * - CSMT (Victorian Gothic terminus with grand central octagonal dome & spires)
 * - Bandra-Worli Sea Link Towers (Pylon cable-stayed diamond towers)
 */

import { BLOCKS } from '../world/block-registry.js';
import { CHUNK_SIZE_X, CHUNK_SIZE_Z } from '../world/constants.js';

export class LandmarkRegistry {
  /**
   * Stamps a landmark model if the feature matches a known landmark tag or name
   * @param {import('../world/chunk.js').Chunk} chunk
   * @param {number} originX
   * @param {number} originZ
   * @param {Object} properties
   * @param {number} centerX - local world X
   * @param {number} centerZ - local world Z
   * @returns {boolean} true if a landmark was stamped
   */
  static tryStampLandmark(chunk, originX, originZ, properties, centerX, centerZ) {
    const name = (properties.name || '').toLowerCase();
    const landmark = properties.landmark || '';

    if (landmark === 'gateway_of_india' || name.includes('gateway of india')) {
      LandmarkRegistry.stampGatewayOfIndia(chunk, originX, originZ, centerX, centerZ);
      return true;
    }

    if (landmark === 'csmt' || name.includes('chhatrapati shivaji') || name.includes('victoria terminus')) {
      LandmarkRegistry.stampCSMT(chunk, originX, originZ, centerX, centerZ);
      return true;
    }

    if (name.includes('taj mahal palace')) {
      LandmarkRegistry.stampTajHotel(chunk, originX, originZ, centerX, centerZ);
      return true;
    }

    return false;
  }

  /**
   * Gateway of India
   * Dimensions: 24m wide, 16m deep, 26m high
   * Basalt triumphal arch with 3 arches, 4 corner turrets, and central dome
   */
  static stampGatewayOfIndia(chunk, originX, originZ, cx, cz) {
    const width = 24;
    const depth = 16;
    const height = 26;
    const startX = Math.round(cx - width / 2);
    const startZ = Math.round(cz - depth / 2);
    const baseY = 21;

    for (let dy = 0; dy < height; dy++) {
      const y = baseY + dy;
      for (let dz = 0; dz < depth; dz++) {
        const z = startZ + dz;
        const lz = z - originZ;
        if (lz < 0 || lz >= CHUNK_SIZE_Z) continue;

        for (let dx = 0; dx < width; dx++) {
          const x = startX + dx;
          const lx = x - originX;
          if (lx < 0 || lx >= CHUNK_SIZE_X) continue;

          // Pier pillars and main archway opening
          const isCentralArch = (dx >= 9 && dx <= 14 && dz >= 2 && dz <= depth - 3 && dy < 16);
          const isSideArchLeft = (dx >= 3 && dx <= 6 && dz >= 2 && dz <= depth - 3 && dy < 10);
          const isSideArchRight = (dx >= 17 && dx <= 20 && dz >= 2 && dz <= depth - 3 && dy < 10);

          if (isCentralArch || isSideArchLeft || isSideArchRight) {
            // Arch opening - fill with air
            chunk.setBlock(lx, y, lz, BLOCKS.AIR);
            continue;
          }

          // Corner turrets (fluted minarets at 4 corners)
          const isCornerTurret = (
            (dx <= 2 || dx >= width - 3) &&
            (dz <= 2 || dz >= depth - 3)
          );

          if (dy >= 20 && dy <= 25) {
            // Central dome atop the arch
            const rx = dx - 11.5;
            const rz = dz - 7.5;
            const dist = Math.sqrt(rx * rx + rz * rz);
            if (dist <= 5.5 && dy <= 20 + Math.sqrt(Math.max(0, 30 - dist * dist))) {
              chunk.setBlock(lx, y, lz, BLOCKS.GOTHIC_SANDSTONE);
              continue;
            }
          }

          if (dy >= 20) {
            // Roof parapet & turrets
            if (isCornerTurret) {
              chunk.setBlock(lx, y, lz, BLOCKS.GOTHIC_SANDSTONE);
            } else if (dx === 0 || dx === width - 1 || dz === 0 || dz === depth - 1) {
              // Intricate yellow basalt jali parapet
              chunk.setBlock(lx, y, lz, BLOCKS.KERB);
            }
            continue;
          }

          // Main arch body: Yellow/warm Basalt and Sandstone
          if (dx === 0 || dx === width - 1 || dz === 0 || dz === depth - 1) {
            chunk.setBlock(lx, y, lz, BLOCKS.GOTHIC_SANDSTONE);
          } else {
            chunk.setBlock(lx, y, lz, BLOCKS.STONE_BRICK);
          }
        }
      }
    }
  }

  /**
   * CSMT (Victoria Terminus)
   * High Victorian Gothic with grand octagonal dome, spires, and arched windows
   */
  static stampCSMT(chunk, originX, originZ, cx, cz) {
    const width = 32;
    const depth = 22;
    const height = 36;
    const startX = Math.round(cx - width / 2);
    const startZ = Math.round(cz - depth / 2);
    const baseY = 21;

    for (let dy = 0; dy < height; dy++) {
      const y = baseY + dy;
      for (let dz = 0; dz < depth; dz++) {
        const z = startZ + dz;
        const lz = z - originZ;
        if (lz < 0 || lz >= CHUNK_SIZE_Z) continue;

        for (let dx = 0; dx < width; dx++) {
          const x = startX + dx;
          const lx = x - originX;
          if (lx < 0 || lx >= CHUNK_SIZE_X) continue;

          // Central Grand Octagonal Dome
          const isCenter = (dx >= 12 && dx <= 19 && dz >= 7 && dz <= 14);
          if (isCenter && dy >= 22) {
            const rx = dx - 15.5;
            const rz = dz - 10.5;
            const dist = Math.sqrt(rx * rx + rz * rz);
            if (dist <= 4.5 && dy <= 34) {
              // Magnificent central rib dome
              chunk.setBlock(lx, y, lz, (dy === 34) ? BLOCKS.LANTERN : BLOCKS.GOTHIC_SANDSTONE);
              continue;
            }
          }

          // Gothic spires at the two forward corners
          const isSpire = ((dx <= 2 || dx >= width - 3) && dz <= 2);
          if (isSpire && dy >= 20 && dy <= 30) {
            chunk.setBlock(lx, y, lz, BLOCKS.STONE_BRICK);
            continue;
          }

          if (dy < 20) {
            const isExterior = (dx === 0 || dx === width - 1 || dz === 0 || dz === depth - 1);
            if (isExterior) {
              // Gothic arched windows on levels 1 and 2
              const isWindow = (dy % 4 === 1 || dy % 4 === 2) && (dx % 3 === 0 || dz % 3 === 0);
              chunk.setBlock(lx, y, lz, isWindow ? BLOCKS.GLASS : BLOCKS.GOTHIC_SANDSTONE);
            } else if (dy % 4 === 0) {
              chunk.setBlock(lx, y, lz, BLOCKS.STONE_BRICK);
            }
          }
        }
      }
    }
  }

  /**
   * Taj Mahal Palace Hotel
   * Iconic red Moorish domes, arched balconies, and golden sandstone wings
   */
  static stampTajHotel(chunk, originX, originZ, cx, cz) {
    const width = 28;
    const depth = 20;
    const height = 32;
    const startX = Math.round(cx - width / 2);
    const startZ = Math.round(cz - depth / 2);
    const baseY = 21;

    for (let dy = 0; dy < height; dy++) {
      const y = baseY + dy;
      for (let dz = 0; dz < depth; dz++) {
        const z = startZ + dz;
        const lz = z - originZ;
        if (lz < 0 || lz >= CHUNK_SIZE_Z) continue;

        for (let dx = 0; dx < width; dx++) {
          const x = startX + dx;
          const lx = x - originX;
          if (lx < 0 || lx >= CHUNK_SIZE_X) continue;

          // Iconic central onion dome
          const isCentralDome = (dx >= 11 && dx <= 16 && dz >= 7 && dz <= 12 && dy >= 22);
          if (isCentralDome) {
            const rx = dx - 13.5;
            const rz = dz - 9.5;
            const dist = Math.sqrt(rx * rx + rz * rz);
            if (dist <= 3.5) {
              chunk.setBlock(lx, y, lz, BLOCKS.BRICK_RED); // Historic red dome
              continue;
            }
          }

          if (dy < 22) {
            const isExterior = (dx === 0 || dx === width - 1 || dz === 0 || dz === depth - 1);
            if (isExterior) {
              const isWindow = (dy % 3 === 1);
              chunk.setBlock(lx, y, lz, isWindow ? BLOCKS.GLASS_CLEAR : BLOCKS.GOTHIC_SANDSTONE);
            } else if (dy % 4 === 0) {
              chunk.setBlock(lx, y, lz, BLOCKS.CONCRETE_ROUGH);
            }
          }
        }
      }
    }
  }
}
