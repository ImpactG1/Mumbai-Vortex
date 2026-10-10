# Contributing to Voxel Mumbai 🌊🏙️

Thank you for your interest in contributing to **Voxel Mumbai**! We welcome all contributions from the community—whether it's adding new Mumbai landmarks, refining procedural textures, optimizing voxel meshing, or improving mobile touch controls.

---

## 🛠️ Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ImpactG1/Mumbai-Vortex.git
   cd Mumbai-Vortex
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local Vite dev server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000/` in your browser.

4. **Run unit tests**:
   ```bash
   npm test
   ```

5. **Verify production build**:
   ```bash
   npm run build
   ```

---

## 🏗️ How to Add a New Mumbai Landmark

1. Locate or define landmark coordinates and bounding box in `packages/core/src/gen/presets.js` or `bundled-presets.js`.
2. Author your voxel architecture stamp in `packages/core/src/gen/landmarks.js`.
3. Test the landmark by opening `http://localhost:3000/?preset=<your_preset_id>`.

---

## 📝 Submitting a Pull Request

1. Fork the repo and create your branch from `main`:
   ```bash
   git checkout -b feature/amazing-landmark
   ```
2. Commit your changes with a clear commit message:
   ```bash
   git commit -m "feat(landmarks): add Bandra Bandstand voxel model"
   ```
3. Push to your branch and open a Pull Request on GitHub.
4. Ensure all GitHub Actions CI checks pass!

---

## 📜 Code of Conduct
Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).
