/**
 * Voxel Mumbai - Procedural Texture Atlas Generator
 * Generates all 32x32 pixel art textures for Mumbai architecture, transit,
 * flora, and building materials into a single texture atlas with UV mappings.
 * Works seamlessly in both browser (Canvas / DataTexture) and Node.
 */

export const TILE_SIZE = 32;
export const ATLAS_TILES_PER_ROW = 16;
export const ATLAS_WIDTH = TILE_SIZE * ATLAS_TILES_PER_ROW; // 512 px
export const ATLAS_HEIGHT = ATLAS_WIDTH; // 512 px

// Simple pseudo-random seeded noise for consistent procedural textures
function pseudoRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Creates an RGBA pixel buffer for a 32x32 tile
 */
function createTileBuffer() {
  return new Uint8ClampedArray(TILE_SIZE * TILE_SIZE * 4);
}

function setPixel(buf, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= TILE_SIZE || y < 0 || y >= TILE_SIZE) return;
  const idx = (y * TILE_SIZE + x) * 4;
  buf[idx] = Math.max(0, Math.min(255, Math.round(r)));
  buf[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
  buf[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
  buf[idx + 3] = Math.max(0, Math.min(255, Math.round(a)));
}

/**
 * Procedural texture drawers for each named tile
 */
const TILE_GENERATORS = {
  // Dirt & Ground
  dirt: (buf) => {
    const rnd = pseudoRandom(42);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const n = rnd() * 30 - 15;
        setPixel(buf, x, y, 110 + n, 75 + n, 45 + n);
      }
    }
  },
  grass_top: (buf) => {
    const rnd = pseudoRandom(101);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const n = rnd() * 25 - 12;
        // Warm tropical green
        setPixel(buf, x, y, 65 + n, 145 + n, 40 + n);
      }
    }
  },
  grass_side: (buf) => {
    const rnd = pseudoRandom(102);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const n = rnd() * 20 - 10;
        if (y < 6 + (x % 3 === 0 ? 3 : 0)) {
          setPixel(buf, x, y, 65 + n, 145 + n, 40 + n);
        } else {
          setPixel(buf, x, y, 110 + n, 75 + n, 45 + n);
        }
      }
    }
  },
  stone: (buf) => {
    const rnd = pseudoRandom(202);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const n = rnd() * 26 - 13;
        setPixel(buf, x, y, 128 + n, 128 + n, 130 + n);
      }
    }
  },
  sand: (buf) => {
    const rnd = pseudoRandom(303);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const n = rnd() * 20 - 10;
        // Warm Mumbai coastal sand (Juhu/Girgaon)
        setPixel(buf, x, y, 222 + n, 198 + n, 140 + n);
      }
    }
  },
  gravel: (buf) => {
    const rnd = pseudoRandom(404);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const n = rnd() * 40 - 20;
        setPixel(buf, x, y, 115 + n, 115 + n, 112 + n);
      }
    }
  },

  // Mumbai Bedrock & Geology
  laterite: (buf) => {
    // Rust-orange porous stone
    const rnd = pseudoRandom(505);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isPore = rnd() < 0.15;
        const n = rnd() * 30 - 15;
        if (isPore) {
          setPixel(buf, x, y, 110 + n, 45 + n, 25 + n);
        } else {
          setPixel(buf, x, y, 185 + n, 70 + n, 40 + n);
        }
      }
    }
  },
  basalt_top: (buf) => {
    const rnd = pseudoRandom(606);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const n = rnd() * 20 - 10;
        setPixel(buf, x, y, 55 + n, 55 + n, 60 + n);
      }
    }
  },
  basalt_side: (buf) => {
    const rnd = pseudoRandom(607);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const col = Math.floor(x / 8);
        const colOffset = (col % 2) * 5;
        const n = rnd() * 15 - 7;
        setPixel(buf, x, y, 50 + colOffset + n, 50 + colOffset + n, 56 + n);
      }
    }
  },

  // Marine & Water
  water_still: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const ripple = Math.sin((x + y * 0.5) * 0.5) * 15;
        setPixel(buf, x, y, 20 + ripple, 120 + ripple, 210, 180);
      }
    }
  },
  sea_water: (buf) => {
    // Arabian Sea: Teal-green water with subtle white froth
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const wave = Math.sin((x * 0.4 + y * 0.6)) * 20;
        const foam = (x + y) % 16 === 0 ? 30 : 0;
        setPixel(buf, x, y, 15 + wave + foam, 140 + wave + foam, 160 + wave + foam, 190);
      }
    }
  },
  tetrapod: (buf) => {
    // Rough grey concrete with cast seam and weathering
    const rnd = pseudoRandom(707);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isSeam = (x === 15 || y === 15);
        const n = rnd() * 20 - 10;
        if (isSeam) {
          setPixel(buf, x, y, 90 + n, 95 + n, 95 + n);
        } else {
          setPixel(buf, x, y, 150 + n, 155 + n, 155 + n);
        }
      }
    }
  },

  // Roads & Infrastructure
  asphalt: (buf) => {
    const rnd = pseudoRandom(808);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const n = rnd() * 18 - 9;
        setPixel(buf, x, y, 42 + n, 42 + n, 45 + n);
      }
    }
  },
  asphalt_line_white: (buf) => {
    TILE_GENERATORS.asphalt(buf);
    // Centered dashed white lane markings
    for (let y = 4; y < 28; y++) {
      for (let x = 14; x <= 17; x++) {
        setPixel(buf, x, y, 235, 235, 238);
      }
    }
  },
  asphalt_line_yellow: (buf) => {
    TILE_GENERATORS.asphalt(buf);
    // Double solid yellow line
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 13; x <= 14; x++) setPixel(buf, x, y, 245, 195, 30);
      for (let x = 17; x <= 18; x++) setPixel(buf, x, y, 245, 195, 30);
    }
  },
  asphalt_zebra: (buf) => {
    TILE_GENERATORS.asphalt(buf);
    for (let y = 0; y < TILE_SIZE; y++) {
      const isStripe = (Math.floor(x_coord => x_coord, y) % 8) < 4;
      if (isStripe) {
        for (let x = 2; x < 30; x++) {
          setPixel(buf, x, y, 240, 240, 240);
        }
      }
    }
  },
  paving_grey: (buf) => {
    const rnd = pseudoRandom(909);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isBorder = (x % 8 === 0 || y % 8 === 0);
        const n = rnd() * 16 - 8;
        if (isBorder) {
          setPixel(buf, x, y, 120 + n, 120 + n, 122 + n);
        } else {
          setPixel(buf, x, y, 175 + n, 175 + n, 178 + n);
        }
      }
    }
  },
  kerb_top: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isYellow = (Math.floor(x / 8) % 2 === 0);
        if (isYellow) {
          setPixel(buf, x, y, 235, 190, 20);
        } else {
          setPixel(buf, x, y, 45, 45, 45);
        }
      }
    }
  },
  kerb_side: (buf) => {
    TILE_GENERATORS.kerb_top(buf);
  },

  // Railways & Stations
  rail_track: (buf) => {
    // Ballast gravel background
    TILE_GENERATORS.gravel(buf);
    // Wooden sleepers
    for (let y = 0; y < TILE_SIZE; y += 8) {
      for (let sy = y; sy < y + 3; sy++) {
        for (let x = 3; x < 29; x++) {
          setPixel(buf, x, sy, 85, 55, 35);
        }
      }
    }
    // Steel rails (two vertical parallel bars)
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x of [7, 8, 23, 24]) {
        setPixel(buf, x, y, 210, 215, 220);
      }
    }
  },
  rail_platform: (buf) => {
    TILE_GENERATORS.paving_grey(buf);
    // Yellow tactile paving border line along edge
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < 6; x++) {
        const bump = (x % 2 === 0 && y % 2 === 0) ? 20 : 0;
        setPixel(buf, x, y, 240 + bump, 195 + bump, 20);
      }
    }
  },

  // Architecture - Art Deco, Gothic, Chawl, Tin, Tiles
  whitewash_art_deco: (buf) => {
    // Off-white plaster with subtle horizontal grooves & mint/peach trim
    const rnd = pseudoRandom(1010);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isGroove = (y % 8 === 0);
        const isTrim = (y < 3);
        const n = rnd() * 12 - 6;
        if (isTrim) {
          // Pastel mint trim
          setPixel(buf, x, y, 160 + n, 210 + n, 195 + n);
        } else if (isGroove) {
          setPixel(buf, x, y, 195 + n, 195 + n, 195 + n);
        } else {
          setPixel(buf, x, y, 238 + n, 236 + n, 232 + n);
        }
      }
    }
  },
  gothic_sandstone: (buf) => {
    // Warm basalt/sandstone with carved stone blocks and arched motif
    const rnd = pseudoRandom(1111);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isMortar = (y % 8 === 0 || (x + (Math.floor(y / 8) % 2) * 8) % 16 === 0);
        const n = rnd() * 24 - 12;
        if (isMortar) {
          setPixel(buf, x, y, 130 + n, 105 + n, 80 + n);
        } else {
          setPixel(buf, x, y, 185 + n, 145 + n, 108 + n);
        }
      }
    }
  },
  chawl_ochre: (buf) => {
    // Faded ochre with monsoon water staining at bottom
    const rnd = pseudoRandom(1212);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const monsoonStain = (y > 22) ? (y - 22) * 6 : 0;
        const peeling = rnd() < 0.08 ? 35 : 0;
        const n = rnd() * 18 - 9;
        setPixel(buf, x, y, 205 - monsoonStain - peeling + n, 160 - monsoonStain - peeling + n, 75 - monsoonStain + n);
      }
    }
  },
  chawl_blue: (buf) => {
    // Faded blue chawl exterior
    const rnd = pseudoRandom(1313);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const monsoonStain = (y > 22) ? (y - 22) * 5 : 0;
        const n = rnd() * 16 - 8;
        setPixel(buf, x, y, 90 - monsoonStain + n, 150 - monsoonStain + n, 185 - monsoonStain + n);
      }
    }
  },
  tin_roof: (buf) => {
    // Corrugated tin with rust streaks
    const rnd = pseudoRandom(1414);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const rib = Math.sin(x * 0.8) * 35;
        const rust = (x % 7 === 0 && y > 10) ? 60 : 0;
        const n = rnd() * 10 - 5;
        if (rust > 0) {
          setPixel(buf, x, y, 160 + n, 85 + n, 40 + n);
        } else {
          setPixel(buf, x, y, 160 + rib + n, 165 + rib + n, 170 + rib + n);
        }
      }
    }
  },
  tin_roof_side: (buf) => {
    TILE_GENERATORS.tin_roof(buf);
  },
  blue_tarp: (buf) => {
    // Blue woven plastic tarpaulin sheet (ubiquitous Mumbai monsoon fixture)
    const rnd = pseudoRandom(1515);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const weave = ((x + y) % 2 === 0) ? 18 : -18;
        const n = rnd() * 10;
        setPixel(buf, x, y, 20 + n, 100 + weave + n, 210 + weave + n);
      }
    }
  },
  mangalore_tile: (buf) => {
    // Terracotta roof tiles (shingles)
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const row = Math.floor(y / 6);
        const col = (x + row * 8) % 16;
        const edge = (col === 0 || y % 6 === 0);
        if (edge) {
          setPixel(buf, x, y, 130, 50, 30);
        } else {
          setPixel(buf, x, y, 190, 80, 50);
        }
      }
    }
  },
  mangalore_side: (buf) => {
    TILE_GENERATORS.mangalore_tile(buf);
  },
  glass_blue: (buf) => {
    // BKC commercial glass curtain wall with reflective grid
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isFrame = (x === 0 || x === 31 || y === 0 || y === 31);
        if (isFrame) {
          setPixel(buf, x, y, 140, 150, 160, 255);
        } else {
          const sheen = Math.sin((x + y) * 0.3) * 30;
          setPixel(buf, x, y, 80 + sheen, 160 + sheen, 210 + sheen, 200);
        }
      }
    }
  },
  glass_clear: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isFrame = (x === 0 || x === 31 || y === 0 || y === 31);
        if (isFrame) {
          setPixel(buf, x, y, 180, 180, 190, 255);
        } else {
          setPixel(buf, x, y, 220, 235, 245, 90);
        }
      }
    }
  },
  concrete_rough: (buf) => {
    const rnd = pseudoRandom(1616);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const n = rnd() * 24 - 12;
        setPixel(buf, x, y, 145 + n, 145 + n, 145 + n);
      }
    }
  },
  brick_red: (buf) => {
    const rnd = pseudoRandom(1717);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isMortar = (y % 6 === 0 || (x + (Math.floor(y / 6) % 2) * 8) % 16 === 0);
        const n = rnd() * 20 - 10;
        if (isMortar) {
          setPixel(buf, x, y, 180 + n, 175 + n, 170 + n);
        } else {
          setPixel(buf, x, y, 165 + n, 60 + n, 45 + n);
        }
      }
    }
  },
  stone_brick: (buf) => {
    const rnd = pseudoRandom(1818);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isMortar = (y % 8 === 0 || (x + (Math.floor(y / 8) % 2) * 8) % 16 === 0);
        const n = rnd() * 20 - 10;
        if (isMortar) {
          setPixel(buf, x, y, 100 + n, 100 + n, 100 + n);
        } else {
          setPixel(buf, x, y, 150 + n, 150 + n, 150 + n);
        }
      }
    }
  },

  // Wood & Foliage
  wood_oak: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const plank = (y % 8 === 0) ? -30 : 0;
        setPixel(buf, x, y, 160 + plank, 125 + plank, 75 + plank);
      }
    }
  },
  wood_teak: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const plank = (y % 8 === 0) ? -30 : 0;
        setPixel(buf, x, y, 140 + plank, 95 + plank, 50 + plank);
      }
    }
  },
  wood_rosewood: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const plank = (y % 8 === 0) ? -25 : 0;
        setPixel(buf, x, y, 80 + plank, 45 + plank, 35 + plank);
      }
    }
  },
  wood_log_top: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const dx = x - 15.5;
        const dy = y - 15.5;
        const r = Math.sqrt(dx * dx + dy * dy);
        const ring = Math.sin(r * 1.5) * 20;
        if (r > 15) {
          setPixel(buf, x, y, 70, 45, 25);
        } else {
          setPixel(buf, x, y, 150 + ring, 120 + ring, 75);
        }
      }
    }
  },
  wood_log_tree: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const bark = (x % 4 === 0) ? -20 : 0;
        setPixel(buf, x, y, 90 + bark, 60 + bark, 35 + bark);
      }
    }
  },
  wood_log_palm: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const ring = (y % 4 === 0) ? -25 : 0;
        setPixel(buf, x, y, 120 + ring, 85 + ring, 50 + ring);
      }
    }
  },
  leaves_banyan: (buf) => {
    const rnd = pseudoRandom(1919);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        if (rnd() < 0.2) {
          setPixel(buf, x, y, 0, 0, 0, 0); // Cutout transparent hole
        } else {
          const n = rnd() * 30 - 15;
          setPixel(buf, x, y, 35 + n, 115 + n, 30 + n, 255);
        }
      }
    }
  },
  leaves_gulmohar: (buf) => {
    const rnd = pseudoRandom(2020);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        if (rnd() < 0.18) {
          setPixel(buf, x, y, 0, 0, 0, 0);
        } else {
          const isFlower = rnd() < 0.35;
          if (isFlower) {
            setPixel(buf, x, y, 235, 60, 25, 255); // Fiery orange/red flower
          } else {
            setPixel(buf, x, y, 50, 130, 35, 255);
          }
        }
      }
    }
  },
  leaves_palm: (buf) => {
    const rnd = pseudoRandom(2121);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isSpine = (x === y || x === 31 - y);
        if (isSpine || rnd() > 0.3) {
          const n = rnd() * 25 - 12;
          setPixel(buf, x, y, 55 + n, 145 + n, 35 + n, 255);
        } else {
          setPixel(buf, x, y, 0, 0, 0, 0);
        }
      }
    }
  },

  // Transit: Taxi, Bus, Auto, Local Train
  taxi_top: (buf) => {
    // Yellow top of Kaali-Peeli taxi with taxi sign
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isSign = (x >= 12 && x <= 19 && y >= 13 && y <= 18);
        if (isSign) {
          setPixel(buf, x, y, 245, 245, 245);
        } else {
          setPixel(buf, x, y, 245, 195, 20);
        }
      }
    }
  },
  taxi_side: (buf) => {
    // Black lower half, bright yellow upper half
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        if (y < 16) {
          setPixel(buf, x, y, 245, 195, 20); // Yellow
        } else {
          setPixel(buf, x, y, 25, 25, 28); // Black
        }
      }
    }
  },
  taxi_bottom: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        setPixel(buf, x, y, 30, 30, 30);
      }
    }
  },
  bus_top: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        setPixel(buf, x, y, 210, 40, 35);
      }
    }
  },
  bus_side: (buf) => {
    // Red body, cream/white stripe, window band
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        if (y >= 6 && y <= 13) {
          // Window
          setPixel(buf, x, y, 70, 110, 140);
        } else if (y >= 14 && y <= 16) {
          // Cream stripe
          setPixel(buf, x, y, 245, 235, 195);
        } else {
          // Deep red body
          setPixel(buf, x, y, 195, 30, 25);
        }
      }
    }
  },
  bus_bottom: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) setPixel(buf, x, y, 40, 40, 40);
    }
  },
  auto_top: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        setPixel(buf, x, y, 245, 195, 20);
      }
    }
  },
  auto_side: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        if (y < 12) {
          setPixel(buf, x, y, 245, 195, 20); // Yellow hood
        } else {
          setPixel(buf, x, y, 20, 20, 22); // Black bottom
        }
      }
    }
  },
  auto_bottom: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) setPixel(buf, x, y, 35, 35, 35);
    }
  },
  train_top: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        setPixel(buf, x, y, 215, 220, 225);
      }
    }
  },
  train_side: (buf) => {
    // Silver white with red/purple band and dark windows
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        if (y >= 8 && y <= 14) {
          // Window
          setPixel(buf, x, y, 50, 65, 80);
        } else if (y >= 16 && y <= 20) {
          // Crimson / maroon band
          setPixel(buf, x, y, 160, 25, 45);
        } else {
          // Stainless steel silver
          setPixel(buf, x, y, 220, 225, 230);
        }
      }
    }
  },
  train_bottom: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) setPixel(buf, x, y, 45, 45, 48);
    }
  },

  // Props & Street Furniture
  marigold_stall_top: (buf) => {
    // Fresh marigold garlands
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isYellow = (x + y) % 4 === 0;
        if (isYellow) {
          setPixel(buf, x, y, 255, 215, 20);
        } else {
          setPixel(buf, x, y, 245, 120, 15);
        }
      }
    }
  },
  marigold_stall_side: (buf) => {
    // Red & white striped awning
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isStripe = (Math.floor(x / 4) % 2 === 0);
        if (isStripe) {
          setPixel(buf, x, y, 210, 45, 35);
        } else {
          setPixel(buf, x, y, 245, 245, 240);
        }
      }
    }
  },
  lantern: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const isFrame = (x <= 2 || x >= 29 || y <= 2 || y >= 29);
        if (isFrame) {
          setPixel(buf, x, y, 40, 40, 45, 255);
        } else {
          setPixel(buf, x, y, 255, 220, 110, 240); // Warm glowing light
        }
      }
    }
  },
  neon_sign: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        setPixel(buf, x, y, 25, 200, 255, 255);
      }
    }
  },
  sign_shop: (buf) => {
    // Bilingual shop sign
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        if (y < 16) {
          // Devanagari banner (red background with yellow script motif)
          const textPixel = (y === 8 && x > 4 && x < 28) || (y > 4 && y < 12 && x % 4 === 0);
          if (textPixel) {
            setPixel(buf, x, y, 255, 230, 50);
          } else {
            setPixel(buf, x, y, 180, 20, 20);
          }
        } else {
          // English banner (blue background with white lettering)
          const textPixel = (y === 24 && x > 4 && x < 28) || (y > 20 && y < 28 && x % 5 === 0);
          if (textPixel) {
            setPixel(buf, x, y, 255, 255, 255);
          } else {
            setPixel(buf, x, y, 20, 50, 160);
          }
        }
      }
    }
  },
  water_tank_top: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const dx = x - 15.5;
        const dy = y - 15.5;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (r < 6) {
          setPixel(buf, x, y, 20, 20, 20); // Tank cap
        } else {
          setPixel(buf, x, y, 45, 48, 52);
        }
      }
    }
  },
  water_tank_side: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const ridge = (y % 6 === 0) ? 20 : 0;
        setPixel(buf, x, y, 45 + ridge, 48 + ridge, 52 + ridge);
      }
    }
  },
  flower_marigold: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const stem = (x === 15 || x === 16) && y > 12;
        const petal = (Math.abs(x - 15.5) < 7 && Math.abs(y - 10) < 7);
        if (petal) {
          setPixel(buf, x, y, 255, 140, 20, 255);
        } else if (stem) {
          setPixel(buf, x, y, 45, 130, 35, 255);
        } else {
          setPixel(buf, x, y, 0, 0, 0, 0);
        }
      }
    }
  },
  flower_rose: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const stem = (x === 15 || x === 16) && y > 12;
        const petal = (Math.abs(x - 15.5) < 6 && Math.abs(y - 10) < 6);
        if (petal) {
          setPixel(buf, x, y, 220, 30, 45, 255);
        } else if (stem) {
          setPixel(buf, x, y, 45, 130, 35, 255);
        } else {
          setPixel(buf, x, y, 0, 0, 0, 0);
        }
      }
    }
  },
  ladder: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const sideRail = (x === 4 || x === 5 || x === 26 || x === 27);
        const rung = (y % 6 === 0 && x >= 5 && x <= 26);
        if (sideRail || rung) {
          setPixel(buf, x, y, 140, 95, 50, 255);
        } else {
          setPixel(buf, x, y, 0, 0, 0, 0);
        }
      }
    }
  },
  missing: (buf) => {
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const magenta = ((x < 16 && y < 16) || (x >= 16 && y >= 16));
        if (magenta) {
          setPixel(buf, x, y, 240, 30, 210);
        } else {
          setPixel(buf, x, y, 20, 20, 20);
        }
      }
    }
  }
};

// 16 Wool Colors
const WOOL_COLORS = [
  ['wool_white', [240, 240, 240]],
  ['wool_orange', [235, 120, 35]],
  ['wool_magenta', [190, 65, 165]],
  ['wool_light_blue', [105, 165, 225]],
  ['wool_yellow', [240, 210, 45]],
  ['wool_lime', [115, 195, 35]],
  ['wool_pink', [235, 145, 170]],
  ['wool_gray', [70, 75, 80]],
  ['wool_light_gray', [145, 150, 155]],
  ['wool_cyan', [40, 145, 165]],
  ['wool_purple', [125, 50, 175]],
  ['wool_blue', [45, 70, 170]],
  ['wool_brown', [110, 65, 40]],
  ['wool_green', [85, 125, 40]],
  ['wool_red', [175, 45, 40]],
  ['wool_black', [25, 25, 28]]
];

for (const [name, [r, g, b]] of WOOL_COLORS) {
  TILE_GENERATORS[name] = (buf) => {
    const rnd = pseudoRandom(name.length * 100);
    for (let y = 0; y < TILE_SIZE; y++) {
      for (let x = 0; x < TILE_SIZE; x++) {
        const texture = ((x + y) % 3 === 0) ? -10 : 8;
        const n = rnd() * 12 - 6;
        setPixel(buf, x, y, r + texture + n, g + texture + n, b + texture + n);
      }
    }
  };
}

/**
 * Procedural Atlas Builder
 */
export class TextureAtlas {
  constructor() {
    this.width = ATLAS_WIDTH;
    this.height = ATLAS_HEIGHT;
    this.tileSize = TILE_SIZE;
    this.tilesPerRow = ATLAS_TILES_PER_ROW;
    this.uvMap = new Map();
    this.pixels = new Uint8ClampedArray(this.width * this.height * 4);
    this.build();
  }

  build() {
    const tileNames = Object.keys(TILE_GENERATORS);
    let index = 0;

    for (const name of tileNames) {
      if (index >= this.tilesPerRow * this.tilesPerRow) {
        console.warn(`Atlas capacity reached, cannot pack tile: ${name}`);
        break;
      }

      const tx = index % this.tilesPerRow;
      const ty = Math.floor(index / this.tilesPerRow);

      // Generate single tile
      const tileBuf = createTileBuffer();
      TILE_GENERATORS[name](tileBuf);

      // Blit into atlas buffer
      for (let py = 0; py < this.tileSize; py++) {
        for (let px = 0; px < this.tileSize; px++) {
          const srcIdx = (py * this.tileSize + px) * 4;
          const dstX = tx * this.tileSize + px;
          const dstY = ty * this.tileSize + py;
          const dstIdx = (dstY * this.width + dstX) * 4;

          this.pixels[dstIdx] = tileBuf[srcIdx];
          this.pixels[dstIdx + 1] = tileBuf[srcIdx + 1];
          this.pixels[dstIdx + 2] = tileBuf[srcIdx + 2];
          this.pixels[dstIdx + 3] = tileBuf[srcIdx + 3];
        }
      }

      // UV coordinates (OpenGL origin is bottom-left)
      // Clamped slightly (0.01 / 512) to prevent texture bleeding
      const eps = 0.0001;
      const u0 = (tx * this.tileSize) / this.width + eps;
      const u1 = ((tx + 1) * this.tileSize) / this.width - eps;
      // In Three.js CanvasTexture / DataTexture, V=0 is bottom
      const v1 = 1.0 - (ty * this.tileSize) / this.height - eps;
      const v0 = 1.0 - ((ty + 1) * this.tileSize) / this.height + eps;

      this.uvMap.set(name, { u0, v0, u1, v1, tx, ty });
      index++;
    }
  }

  getUV(tileName) {
    return this.uvMap.get(tileName) || this.uvMap.get('missing');
  }

  /**
   * Serializes the UV map for passing to Web Workers
   * @returns {Object<string, {u0: number, v0: number, u1: number, v1: number}>}
   */
  exportUVMap() {
    const obj = {};
    for (const [name, uv] of this.uvMap.entries()) {
      obj[name] = { u0: uv.u0, v0: uv.v0, u1: uv.u1, v1: uv.v1 };
    }
    return obj;
  }
}
