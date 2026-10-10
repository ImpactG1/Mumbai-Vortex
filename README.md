# Voxel Mumbai 🌊🏙️

[![CI & Tests](https://github.com/ImpactG1/Mumbai-Vortex/actions/workflows/ci.yml/badge.svg)](https://github.com/ImpactG1/Mumbai-Vortex/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Three.js](https://img.shields.io/badge/Three.js-r165-blue.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF.svg)](https://vitejs.dev/)
[![OpenStreetMap](https://img.shields.io/badge/Map_Data-OpenStreetMap_(ODbL)-green.svg)](https://www.openstreetmap.org/copyright)
[![GitHub Stars](https://img.shields.io/github/stars/ImpactG1/Mumbai-Vortex?style=social)](https://github.com/ImpactG1/Mumbai-Vortex/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/ImpactG1/Mumbai-Vortex?style=social)](https://github.com/ImpactG1/Mumbai-Vortex/network/members)

> A browser-based, Minecraft-style voxel sandbox where the world is procedurally generated from real **OpenStreetMap (OSM)** vector data and real elevation data of Mumbai. Explore, fly, build on top of the real city, and share exact spots.

---

## 🌟 Highlights

- 🗺️ **Real OpenStreetMap Data**: Query any area in Mumbai via Overpass API with offline fallback.
- 🌊 **Mumbai Vernacular Identity**: Marine Drive tetrapods, Queen's Necklace promenade, Art Deco whitewash, Gothic sandstone (CSMT), Kaali-Peeli taxis, and BEST buses.
- ⚡ **High-Performance Voxel Engine**: Multi-pass Greedy Mesher running in Web Workers with transferable typed arrays (60+ FPS).
- 🌅 **Dynamic Atmosphere**: Golden hour sunset over the Arabian Sea, deep night city lights, and toggleable Monsoon rain.
- 📱 **Mobile & PWA Ready**: Fully decoupled core using `InputAdapter` for seamless iOS/Android wrapping.

---

## 🏛️ Architecture Overview

```
                      +------------------------------------------+
                      |         Web Shell (packages/web)          |
                      |  - Desktop / Touch UI & Hotbar           |
                      |  - KeyboardMouseAdapter / TouchAdapter   |
                      |  - Preset Modal & Search Drawer          |
                      +--------------------+---------------------+
                                           |
                        InputAdapter       |  Platform Events
                                           v
+--------------------------------------------------------------------------------+
|                            Engine Core (packages/core)                         |
|                                                                                |
|   +-------------------+    +--------------------+    +---------------------+   |
|   |  WorldManager     |--->|  OsmFetcher        |--->|  Overpass API /     |   |
|   |  (Coordination &  |    |  (Mirror failover, |    |  IndexedDB Cache /  |   |
|   |   Game Loop)      |    |   Bundled Offline) |    |  Bundled Presets    |   |
|   +---------+---------+    +--------------------+    +---------------------+   |
|             |                                                                  |
|             +------------->+--------------------+    +---------------------+   |
|             |              |  OsmVoxelizer      |<---|  Equirectangular    |   |
|             |              |  (Coast, Tetrapods,|    |  Projection &       |   |
|             |              |   Roads, Buildings)|    |  Terrarium Elevation|   |
|             |              +---------+----------+    +---------------------+   |
|             v                        v                                         |
|   +-------------------+    +--------------------+                              |
|   |  FlyingCamera     |    |  ChunkStore        |                              |
|   |  (6-DOF Free Fly) |    |  (16x16x128 Chunks,|                              |
|   +-------------------+    |   Delta Edits)     |                              |
|                            +---------+----------+                              |
|                                      |                                         |
|                                      v                                         |
|                            +--------------------+                              |
|                            |  MesherClient      |                              |
|                            |  (Worker Pool)     |                              |
|                            +---------+----------+                              |
|                                      | postMessage (Transferable TypedArrays)  |
|                                      v                                         |
|                            +--------------------+                              |
|                            |  Greedy Mesher     |                              |
|                            |  (Web Worker)      |                              |
|                            +---------+----------+                              |
|                                      |                                         |
|                                      v                                         |
|                            +--------------------+                              |
|                            |  WorldRenderer     |                              |
|                            |  (Three.js Scene,  |                              |
|                            |   Procedural Atlas)|                              |
|                            +--------------------+                              |
+--------------------------------------------------------------------------------+
```

---

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/ImpactG1/Mumbai-Vortex.git
cd Mumbai-Vortex

# 2. Install dependencies (Node 20+)
npm install

# 3. Start Vite development server
npm run dev

# 4. Run automated test suite
npm test

# 5. Production build
npm run build
```

Open `http://localhost:3000/` in your browser.

---

## 📍 Curated Mumbai Presets

1. **Marine Drive & Nariman Point** (`?preset=marine_drive`): Queen's Necklace curve, tetrapod breakwaters, Art Deco whitewash buildings, and Arabian Sea sunset.
2. **Gateway of India & Colaba** (`?preset=gateway_india`): Iconic 1911 basalt arch, Taj Mahal Palace hotel, and harbor promenade.
3. **CSMT & Fort** (`?preset=csmt_fort`): UNESCO Victorian Italian Gothic terminus, Central Railway lines, and Dr. D.N. Road.
4. **Bandra-Worli Sea Link & Bandstand** (`?preset=sea_link_bandra`): Cable-stayed bridge and rocky coastal headland.
5. **Dharavi** (`?preset=dharavi`): Dense artisan workshops, blue tarpaulins, and corrugated tin roofs.
6. **Bandra Kurla Complex (BKC)** (`?preset=bkc`): Reflective glass curtain wall skyscrapers and wide avenues.
7. **Juhu Beach** (`?preset=juhu_beach`): Sandy coastline and street food stalls.
8. **Powai Lake** (`?preset=powai_lake`): Freshwater reservoir and lush green foothills.
9. **Sanjay Gandhi National Park** (`?preset=borivali_sgnp`): Wilderness edge with dense canopy.

---

## 🎮 Controls

| Key / Action | Function |
| --- | --- |
| **W, A, S, D** | Move Forward / Left / Backward / Right |
| **Space** | Fly Upwards |
| **Ctrl / C** | Fly Downwards |
| **Shift** | Sprint (Speed boost) |
| **Mouse Drag / Click** | Look around (Pointer Lock) |
| **1 – 9 / Scroll Wheel** | Select Hotbar building block |
| **M** | Open Locations & Presets Drawer |
| **🌅 Sunset / 🌙 Night / ☀️ Day** | Cycle Time of Day |
| **🌧️ Monsoon** | Toggle Monsoon Rain Weather |
| **🔗 Share Spot** | Copy shareable URL with exact lat/lon |

---

## 🏆 GitHub Badges & Achievements

This repository is configured to help you earn GitHub badges and profile achievements:
- **Pull Shark** (🦈): Open and merge pull requests on this repository.
- **Quickdraw** (⚡): Close an issue or PR within 5 minutes of opening.
- **Pair Extraordinaire** (👥): Co-author commits using `Co-authored-by: Name <email>` in commit messages.
- **Starstruck** (⭐): Earn stars on this repo from the developer and open-source community.
- **Galaxy Brain** (🧠): Answer discussions on GitHub once enabled.

---

## 🧪 Testing Suite

Unit test suite covers core mathematical and voxelization algorithms:
- **`tests/projection.test.js`**: Forward projection, inverse unprojection, and bounding box math.
- **`tests/polygon-rasterizer.test.js`**: Scanline rasterization, hole/courtyard exclusion, road ribbon expansion.
- **`tests/elevation.test.js`**: Terrarium RGB elevation decoder and vertical exaggeration clamping.
- **`tests/greedy-mesher.test.js`**: Exact 1:1 UV mapped quads, interior face culling, and typed array packing.
- **`tests/block-registry.test.js`**: Full verification of all 73 block types and UV mappings.

---

## 📜 Licenses & Attribution

- **Software**: [MIT License](LICENSE) © 2026 ImpactG1.
- **Map Data**: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), licensed under the Open Database License (ODbL).
- **Elevation Data**: AWS Open Data Terrain Tiles & NASA SRTM (Public Domain).
- **Artwork & Shaders**: Custom original procedural pixel art and CC0 shaders.
