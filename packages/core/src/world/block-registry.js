/**
 * Voxel Mumbai - Block Registry
 * Defines all voxel types, material properties, face mappings, transparency,
 * shapes, and lighting attributes.
 */

export const BLOCKS = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  SAND: 4,
  GRAVEL: 5,
  LATERITE: 6,
  BASALT: 7,
  WATER: 8,
  SEA_WATER: 9,
  ASPHALT: 10,
  ASPHALT_LINE_WHITE: 11,
  ASPHALT_LINE_YELLOW: 12,
  ASPHALT_ZEBRA: 13,
  PAVING_GREY: 14,
  KERB: 15,
  WHITEWASH_ART_DECO: 16,
  GOTHIC_SANDSTONE: 17,
  CHAWL_WALL_OCHRE: 18,
  CHAWL_WALL_BLUE: 19,
  GLASS: 20,
  GLASS_CLEAR: 21,
  TIN_ROOF_CORRUGATED: 22,
  TIN_ROOF_BLUE_TARP: 23,
  MANGALORE_TILE: 24,
  TETRAPOD: 25,
  RAIL_BALLAST: 26,
  RAIL_PLATFORM: 27,
  WOOD_OAK: 28,
  WOOD_TEAK: 29,
  WOOD_ROSEWOOD: 30,
  LEAVES_BANYAN: 31,
  LEAVES_GULMOHAR: 32,
  LEAVES_PALM: 33,
  WOOD_LOG_PALM: 34,
  WOOD_LOG_TREE: 35,
  BRICK_RED: 36,
  STONE_BRICK: 37,
  CONCRETE_ROUGH: 38,
  MARIGOLD_STALL: 39,
  TAXI_BODY: 40,
  BEST_BUS: 41,
  AUTO_RICKSHAW: 42,
  LOCAL_TRAIN: 43,
  LANTERN: 44,
  NEON_SIGN: 45,
  SIGN_SHOP_DEVANAGARI: 46,
  // 16 Wool/Color Blocks (47..62)
  WOOL_WHITE: 47,
  WOOL_ORANGE: 48,
  WOOL_MAGENTA: 49,
  WOOL_LIGHT_BLUE: 50,
  WOOL_YELLOW: 51,
  WOOL_LIME: 52,
  WOOL_PINK: 53,
  WOOL_GRAY: 54,
  WOOL_LIGHT_GRAY: 55,
  WOOL_CYAN: 56,
  WOOL_PURPLE: 57,
  WOOL_BLUE: 58,
  WOOL_BROWN: 59,
  WOOL_GREEN: 60,
  WOOL_RED: 61,
  WOOL_BLACK: 62,
  // Flora & Props
  FLOWER_MARIGOLD: 63,
  FLOWER_ROSE: 64,
  LADDER: 65,
  FENCE_WOOD: 66,
  SLAB_STONE: 67,
  SLAB_WOOD: 68,
  STAIR_STONE: 69,
  STAIR_WOOD: 70,
  SPEED_BREAKER: 71,
  WATER_TANK: 72
};

/**
 * Shape types:
 * - 'cube': Standard 1x1x1 solid block
 * - 'slab': Half-height block (y: 0 to 0.5)
 * - 'stair': Stair geometry
 * - 'cross-plane': Two intersecting diagonal planes (flora/flowers)
 * - 'fence': Thin post + rails
 * - 'thin-panel': Flat wall plane (ladder)
 */

export const BLOCK_DEFS = {
  [BLOCKS.AIR]: {
    id: BLOCKS.AIR,
    name: 'Air',
    solid: false,
    transparent: true,
    lightEmission: 0,
    faces: null,
    shape: 'cube'
  },
  [BLOCKS.GRASS]: {
    id: BLOCKS.GRASS,
    name: 'Grass Block',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'grass_top', bottom: 'dirt', side: 'grass_side' },
    sound: 'grass',
    shape: 'cube'
  },
  [BLOCKS.DIRT]: {
    id: BLOCKS.DIRT,
    name: 'Dirt',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'dirt' },
    sound: 'gravel',
    shape: 'cube'
  },
  [BLOCKS.STONE]: {
    id: BLOCKS.STONE,
    name: 'Stone',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'stone' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.SAND]: {
    id: BLOCKS.SAND,
    name: 'Sand',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'sand' },
    sound: 'sand',
    shape: 'cube'
  },
  [BLOCKS.GRAVEL]: {
    id: BLOCKS.GRAVEL,
    name: 'Gravel',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'gravel' },
    sound: 'gravel',
    shape: 'cube'
  },
  [BLOCKS.LATERITE]: {
    id: BLOCKS.LATERITE,
    name: 'Laterite Stone',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'laterite' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.BASALT]: {
    id: BLOCKS.BASALT,
    name: 'Basalt',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'basalt_top', bottom: 'basalt_top', side: 'basalt_side' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.WATER]: {
    id: BLOCKS.WATER,
    name: 'Water',
    solid: false,
    transparent: true,
    isFluid: true,
    lightEmission: 0,
    faces: { all: 'water_still' },
    sound: 'water',
    shape: 'cube'
  },
  [BLOCKS.SEA_WATER]: {
    id: BLOCKS.SEA_WATER,
    name: 'Arabian Sea Water',
    solid: false,
    transparent: true,
    isFluid: true,
    lightEmission: 0,
    faces: { all: 'sea_water' },
    sound: 'water',
    shape: 'cube'
  },
  [BLOCKS.ASPHALT]: {
    id: BLOCKS.ASPHALT,
    name: 'Asphalt Road',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'asphalt', bottom: 'dirt', side: 'asphalt' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.ASPHALT_LINE_WHITE]: {
    id: BLOCKS.ASPHALT_LINE_WHITE,
    name: 'Asphalt (White Line)',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'asphalt_line_white', bottom: 'dirt', side: 'asphalt' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.ASPHALT_LINE_YELLOW]: {
    id: BLOCKS.ASPHALT_LINE_YELLOW,
    name: 'Asphalt (Yellow Line)',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'asphalt_line_yellow', bottom: 'dirt', side: 'asphalt' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.ASPHALT_ZEBRA]: {
    id: BLOCKS.ASPHALT_ZEBRA,
    name: 'Zebra Crossing',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'asphalt_zebra', bottom: 'dirt', side: 'asphalt' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.PAVING_GREY]: {
    id: BLOCKS.PAVING_GREY,
    name: 'Grey Paving',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'paving_grey' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.KERB]: {
    id: BLOCKS.KERB,
    name: 'Kerb Stone',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'kerb_top', bottom: 'paving_grey', side: 'kerb_side' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.WHITEWASH_ART_DECO]: {
    id: BLOCKS.WHITEWASH_ART_DECO,
    name: 'Art Deco Whitewash',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'whitewash_art_deco' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.GOTHIC_SANDSTONE]: {
    id: BLOCKS.GOTHIC_SANDSTONE,
    name: 'Gothic Sandstone (CSMT)',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'gothic_sandstone' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.CHAWL_WALL_OCHRE]: {
    id: BLOCKS.CHAWL_WALL_OCHRE,
    name: 'Chawl Wall (Ochre)',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'chawl_ochre' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.CHAWL_WALL_BLUE]: {
    id: BLOCKS.CHAWL_WALL_BLUE,
    name: 'Chawl Wall (Blue)',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'chawl_blue' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.GLASS]: {
    id: BLOCKS.GLASS,
    name: 'Curtain Wall Glass',
    solid: true,
    transparent: true,
    lightEmission: 0,
    faces: { all: 'glass_blue' },
    sound: 'glass',
    shape: 'cube'
  },
  [BLOCKS.GLASS_CLEAR]: {
    id: BLOCKS.GLASS_CLEAR,
    name: 'Clear Glass',
    solid: true,
    transparent: true,
    lightEmission: 0,
    faces: { all: 'glass_clear' },
    sound: 'glass',
    shape: 'cube'
  },
  [BLOCKS.TIN_ROOF_CORRUGATED]: {
    id: BLOCKS.TIN_ROOF_CORRUGATED,
    name: 'Corrugated Tin Roof',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'tin_roof', bottom: 'tin_roof', side: 'tin_roof_side' },
    sound: 'metal',
    shape: 'cube'
  },
  [BLOCKS.TIN_ROOF_BLUE_TARP]: {
    id: BLOCKS.TIN_ROOF_BLUE_TARP,
    name: 'Blue Tarpaulin Sheet',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'blue_tarp' },
    sound: 'cloth',
    shape: 'cube'
  },
  [BLOCKS.MANGALORE_TILE]: {
    id: BLOCKS.MANGALORE_TILE,
    name: 'Mangalore Roof Tile',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'mangalore_tile', bottom: 'mangalore_tile', side: 'mangalore_side' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.TETRAPOD]: {
    id: BLOCKS.TETRAPOD,
    name: 'Marine Drive Tetrapod',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'tetrapod' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.RAIL_BALLAST]: {
    id: BLOCKS.RAIL_BALLAST,
    name: 'Railway Track & Ballast',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'rail_track', bottom: 'gravel', side: 'gravel' },
    sound: 'gravel',
    shape: 'cube'
  },
  [BLOCKS.RAIL_PLATFORM]: {
    id: BLOCKS.RAIL_PLATFORM,
    name: 'Station Platform Slab',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'rail_platform', bottom: 'concrete_rough', side: 'concrete_rough' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.WOOD_OAK]: {
    id: BLOCKS.WOOD_OAK,
    name: 'Oak Planks',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'wood_oak' },
    sound: 'wood',
    shape: 'cube'
  },
  [BLOCKS.WOOD_TEAK]: {
    id: BLOCKS.WOOD_TEAK,
    name: 'Teak Planks',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'wood_teak' },
    sound: 'wood',
    shape: 'cube'
  },
  [BLOCKS.WOOD_ROSEWOOD]: {
    id: BLOCKS.WOOD_ROSEWOOD,
    name: 'Rosewood Planks',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'wood_rosewood' },
    sound: 'wood',
    shape: 'cube'
  },
  [BLOCKS.LEAVES_BANYAN]: {
    id: BLOCKS.LEAVES_BANYAN,
    name: 'Banyan Leaves',
    solid: true,
    transparent: true,
    isCutout: true,
    lightEmission: 0,
    faces: { all: 'leaves_banyan' },
    sound: 'grass',
    shape: 'cube'
  },
  [BLOCKS.LEAVES_GULMOHAR]: {
    id: BLOCKS.LEAVES_GULMOHAR,
    name: 'Gulmohar Red Flowers',
    solid: true,
    transparent: true,
    isCutout: true,
    lightEmission: 0,
    faces: { all: 'leaves_gulmohar' },
    sound: 'grass',
    shape: 'cube'
  },
  [BLOCKS.LEAVES_PALM]: {
    id: BLOCKS.LEAVES_PALM,
    name: 'Coconut Palm Fronds',
    solid: true,
    transparent: true,
    isCutout: true,
    lightEmission: 0,
    faces: { all: 'leaves_palm' },
    sound: 'grass',
    shape: 'cube'
  },
  [BLOCKS.WOOD_LOG_PALM]: {
    id: BLOCKS.WOOD_LOG_PALM,
    name: 'Palm Log',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'wood_log_top', bottom: 'wood_log_top', side: 'wood_log_palm' },
    sound: 'wood',
    shape: 'cube'
  },
  [BLOCKS.WOOD_LOG_TREE]: {
    id: BLOCKS.WOOD_LOG_TREE,
    name: 'Tree Log',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'wood_log_top', bottom: 'wood_log_top', side: 'wood_log_tree' },
    sound: 'wood',
    shape: 'cube'
  },
  [BLOCKS.BRICK_RED]: {
    id: BLOCKS.BRICK_RED,
    name: 'Red Brick',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'brick_red' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.STONE_BRICK]: {
    id: BLOCKS.STONE_BRICK,
    name: 'Stone Brick',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'stone_brick' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.CONCRETE_ROUGH]: {
    id: BLOCKS.CONCRETE_ROUGH,
    name: 'Rough Concrete',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { all: 'concrete_rough' },
    sound: 'stone',
    shape: 'cube'
  },
  [BLOCKS.MARIGOLD_STALL]: {
    id: BLOCKS.MARIGOLD_STALL,
    name: 'Marigold Flower Stall',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'marigold_stall_top', bottom: 'wood_teak', side: 'marigold_stall_side' },
    sound: 'cloth',
    shape: 'cube'
  },
  [BLOCKS.TAXI_BODY]: {
    id: BLOCKS.TAXI_BODY,
    name: 'Kaali-Peeli Taxi Body',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'taxi_top', bottom: 'taxi_bottom', side: 'taxi_side' },
    sound: 'metal',
    shape: 'cube'
  },
  [BLOCKS.BEST_BUS]: {
    id: BLOCKS.BEST_BUS,
    name: 'BEST Bus Body',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'bus_top', bottom: 'bus_bottom', side: 'bus_side' },
    sound: 'metal',
    shape: 'cube'
  },
  [BLOCKS.AUTO_RICKSHAW]: {
    id: BLOCKS.AUTO_RICKSHAW,
    name: 'Auto-Rickshaw Body',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'auto_top', bottom: 'auto_bottom', side: 'auto_side' },
    sound: 'metal',
    shape: 'cube'
  },
  [BLOCKS.LOCAL_TRAIN]: {
    id: BLOCKS.LOCAL_TRAIN,
    name: 'Mumbai Local Coach',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'train_top', bottom: 'train_bottom', side: 'train_side' },
    sound: 'metal',
    shape: 'cube'
  },
  [BLOCKS.LANTERN]: {
    id: BLOCKS.LANTERN,
    name: 'Street Lantern',
    solid: false,
    transparent: true,
    lightEmission: 15,
    faces: { all: 'lantern' },
    sound: 'glass',
    shape: 'cube'
  },
  [BLOCKS.NEON_SIGN]: {
    id: BLOCKS.NEON_SIGN,
    name: 'Neon Signboard',
    solid: true,
    transparent: false,
    lightEmission: 14,
    faces: { all: 'neon_sign' },
    sound: 'glass',
    shape: 'cube'
  },
  [BLOCKS.SIGN_SHOP_DEVANAGARI]: {
    id: BLOCKS.SIGN_SHOP_DEVANAGARI,
    name: 'Devanagari Shop Sign',
    solid: true,
    transparent: false,
    lightEmission: 0,
    faces: { top: 'concrete_rough', bottom: 'concrete_rough', side: 'sign_shop' },
    sound: 'wood',
    shape: 'cube'
  },
  // Wool / Color Blocks
  [BLOCKS.WOOL_WHITE]: { id: BLOCKS.WOOL_WHITE, name: 'White Wool', solid: true, transparent: false, faces: { all: 'wool_white' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_ORANGE]: { id: BLOCKS.WOOL_ORANGE, name: 'Orange Wool', solid: true, transparent: false, faces: { all: 'wool_orange' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_MAGENTA]: { id: BLOCKS.WOOL_MAGENTA, name: 'Magenta Wool', solid: true, transparent: false, faces: { all: 'wool_magenta' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_LIGHT_BLUE]: { id: BLOCKS.WOOL_LIGHT_BLUE, name: 'Light Blue Wool', solid: true, transparent: false, faces: { all: 'wool_light_blue' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_YELLOW]: { id: BLOCKS.WOOL_YELLOW, name: 'Yellow Wool', solid: true, transparent: false, faces: { all: 'wool_yellow' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_LIME]: { id: BLOCKS.WOOL_LIME, name: 'Lime Wool', solid: true, transparent: false, faces: { all: 'wool_lime' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_PINK]: { id: BLOCKS.WOOL_PINK, name: 'Pink Wool', solid: true, transparent: false, faces: { all: 'wool_pink' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_GRAY]: { id: BLOCKS.WOOL_GRAY, name: 'Gray Wool', solid: true, transparent: false, faces: { all: 'wool_gray' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_LIGHT_GRAY]: { id: BLOCKS.WOOL_LIGHT_GRAY, name: 'Light Gray Wool', solid: true, transparent: false, faces: { all: 'wool_light_gray' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_CYAN]: { id: BLOCKS.WOOL_CYAN, name: 'Cyan Wool', solid: true, transparent: false, faces: { all: 'wool_cyan' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_PURPLE]: { id: BLOCKS.WOOL_PURPLE, name: 'Purple Wool', solid: true, transparent: false, faces: { all: 'wool_purple' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_BLUE]: { id: BLOCKS.WOOL_BLUE, name: 'Blue Wool', solid: true, transparent: false, faces: { all: 'wool_blue' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_BROWN]: { id: BLOCKS.WOOL_BROWN, name: 'Brown Wool', solid: true, transparent: false, faces: { all: 'wool_brown' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_GREEN]: { id: BLOCKS.WOOL_GREEN, name: 'Green Wool', solid: true, transparent: false, faces: { all: 'wool_green' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_RED]: { id: BLOCKS.WOOL_RED, name: 'Red Wool', solid: true, transparent: false, faces: { all: 'wool_red' }, sound: 'cloth', shape: 'cube' },
  [BLOCKS.WOOL_BLACK]: { id: BLOCKS.WOOL_BLACK, name: 'Black Wool', solid: true, transparent: false, faces: { all: 'wool_black' }, sound: 'cloth', shape: 'cube' },

  // Props & flora
  [BLOCKS.FLOWER_MARIGOLD]: { id: BLOCKS.FLOWER_MARIGOLD, name: 'Marigold (Genda)', solid: false, transparent: true, isCutout: true, faces: { all: 'flower_marigold' }, sound: 'grass', shape: 'cross-plane' },
  [BLOCKS.FLOWER_ROSE]: { id: BLOCKS.FLOWER_ROSE, name: 'Rose', solid: false, transparent: true, isCutout: true, faces: { all: 'flower_rose' }, sound: 'grass', shape: 'cross-plane' },
  [BLOCKS.LADDER]: { id: BLOCKS.LADDER, name: 'Ladder', solid: false, transparent: true, isCutout: true, faces: { all: 'ladder' }, sound: 'wood', shape: 'thin-panel' },
  [BLOCKS.FENCE_WOOD]: { id: BLOCKS.FENCE_WOOD, name: 'Wooden Fence', solid: true, transparent: true, isCutout: true, faces: { all: 'wood_teak' }, sound: 'wood', shape: 'fence' },
  [BLOCKS.SLAB_STONE]: { id: BLOCKS.SLAB_STONE, name: 'Stone Slab', solid: true, transparent: false, faces: { all: 'stone' }, sound: 'stone', shape: 'slab' },
  [BLOCKS.SLAB_WOOD]: { id: BLOCKS.SLAB_WOOD, name: 'Wood Slab', solid: true, transparent: false, faces: { all: 'wood_teak' }, sound: 'wood', shape: 'slab' },
  [BLOCKS.STAIR_STONE]: { id: BLOCKS.STAIR_STONE, name: 'Stone Stairs', solid: true, transparent: false, faces: { all: 'stone' }, sound: 'stone', shape: 'stair' },
  [BLOCKS.STAIR_WOOD]: { id: BLOCKS.STAIR_WOOD, name: 'Wood Stairs', solid: true, transparent: false, faces: { all: 'wood_teak' }, sound: 'wood', shape: 'stair' },
  [BLOCKS.SPEED_BREAKER]: { id: BLOCKS.SPEED_BREAKER, name: 'Speed Breaker', solid: true, transparent: false, faces: { top: 'asphalt_zebra', bottom: 'asphalt', side: 'asphalt' }, sound: 'stone', shape: 'slab' },
  [BLOCKS.WATER_TANK]: { id: BLOCKS.WATER_TANK, name: 'Rooftop Water Tank', solid: true, transparent: false, faces: { top: 'water_tank_top', bottom: 'water_tank_side', side: 'water_tank_side' }, sound: 'metal', shape: 'cube' }
};

/**
 * Helper to get face texture name for a given block ID and face direction.
 * Direction: 'top' (+Y), 'bottom' (-Y), 'north' (-Z), 'south' (+Z), 'east' (+X), 'west' (-X), or 'side'
 * @param {number} blockId
 * @param {string} faceDirection
 * @returns {string} textureName
 */
export function getFaceTextureName(blockId, faceDirection) {
  const def = BLOCK_DEFS[blockId];
  if (!def || !def.faces) return 'missing';
  if (def.faces.all) return def.faces.all;
  if (faceDirection === 'top' && def.faces.top) return def.faces.top;
  if (faceDirection === 'bottom' && def.faces.bottom) return def.faces.bottom;
  if (def.faces[faceDirection]) return def.faces[faceDirection];
  if (def.faces.side) return def.faces.side;
  return 'missing';
}

/**
 * Returns whether block is opaque, cutout, or transparent fluid/glass.
 * @param {number} blockId
 * @returns {'opaque' | 'cutout' | 'transparent' | 'air'}
 */
export function getBlockRenderPass(blockId) {
  if (blockId === BLOCKS.AIR) return 'air';
  const def = BLOCK_DEFS[blockId];
  if (!def) return 'opaque';
  if (def.isCutout) return 'cutout';
  if (def.transparent) return 'transparent';
  return 'opaque';
}
