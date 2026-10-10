# Changelog — Voxel Mumbai

## [0.3.0] - Phase 3: Detail, Atmosphere & Architectural Refinements
### Fixed
- **Pixel-Perfect Texture Atlas UV Mapping** (`packages/core/src/mesh/greedy-mesher.js`, `atlas-generator.js`):
  - Fixed the atlas wrapping bug where UVs spanned across multiple neighboring tiles, eliminating the noisy glitch mosaic.
  - Every voxel quad now strictly bounds UVs `[u0, v0]` to `[u1, v1]` within its assigned 32x32 tile.
  - Used HTML5 CanvasTexture upload for guaranteed orientation alignment and clean mipmapping without bleeding.
- **Solid Building Perimeter Walls & Windows** (`packages/core/src/gen/osm-voxelizer.js`):
  - Fixed the perimeter detection logic to evaluate 4-orthogonal neighbors inside the building polygon footprint.
  - Buildings now feature solid exterior walls from ground to roof with architectural window rhythms, eliminating floating shelves and missing walls.
  - Ground levels in coastal plains (Marine Drive, Gateway of India, Fort) set flat at `y = 21`, seating roads and buildings flush with zero gaps.

### Added
- **Hand-Authored Architectural Landmark Voxel Models** (`packages/core/src/gen/landmarks.js`):
  - **Gateway of India**: Majestic basalt triumphal arch with 3 arch openings, fluted corner turrets, and central ribbed dome.
  - **CSMT (Victoria Terminus)**: High Victorian Italian Gothic terminus with grand central octagonal dome, spires, and arched windows.
  - **Taj Mahal Palace Hotel**: Red Moorish domes and golden sandstone wings overlooking the Arabian Sea harbor.
- **Dynamic Day/Night Cycle & Golden Hour Sunset** (`packages/core/src/render/world-renderer.js`):
  - Default time set to 17:30 (iconic Mumbai Golden Hour sunset over the Arabian Sea) with warm orange directional sunlight, long shadows, and sea bounce.
  - Smooth progression to deep indigo Mumbai night with illuminated building windows, street lanterns, and stars.
  - UI button to cycle between Sunset (`🌅`), Night (`🌙`), and Daylight (`☀️`).
- **Monsoon Weather System**:
  - Instanced falling rain streaks, storm sky darkening, and wet coastal haze.
  - UI toggle button (`🌧️ Monsoon`).

## [0.2.0] - Phase 2: Real Data Pipeline & OpenStreetMap Voxelization
### Added
- Equirectangular projection engine and dynamic inverse unprojection.
- OSM Overpass client with mirror rotation, IndexedDB cache, and bundled offline datasets.
- Topographic Terrarium RGB elevation decoder with 2.0x vertical exaggeration.
- Scanline polygon filling with courtyard hole exclusion and road ribbon expansion.
- Real OSM voxelization with 10 curated Mumbai location presets and URL sharing.

## [0.1.0] - Phase 1: Engine Foundation
### Added
- Clean ES modules architecture with Three.js, Vite, and mobile-ready InputAdapter.
- 73 custom Mumbai vernacular, transit, architectural, and builder block types.
- Procedural Texture Atlas generator producing 83 32x32 textures.
- Multi-pass Greedy Mesher running in Web Workers with transferable typed arrays.
