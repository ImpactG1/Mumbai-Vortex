/**
 * Voxel Mumbai - Web Shell Entry Point
 * Phase 2: OpenStreetMap real world integration, location presets modal,
 * dynamic search, URL state sharing, and hotbar.
 */

import { WorldManager } from '../../core/src/world/world-manager.js';
import { KeyboardMouseAdapter } from './keyboard-mouse-adapter.js';
import { BLOCKS, BLOCK_DEFS } from '../../core/src/world/block-registry.js';
import { PRESETS, getPresetById } from '../../core/src/gen/presets.js';

const canvas = document.getElementById('voxel-canvas');
const fpsEl = document.getElementById('stat-fps');
const chunksEl = document.getElementById('stat-chunks');
const latlonEl = document.getElementById('stat-latlon');
const activeLocEl = document.getElementById('active-location-name');
const promptEl = document.getElementById('pointer-lock-prompt');
const hotbarEl = document.getElementById('hotbar');

// Modals & Overlays
const presetModal = document.getElementById('preset-modal');
const presetGrid = document.getElementById('preset-grid');
const searchInput = document.getElementById('preset-search-input');
const btnOpenPresets = document.getElementById('btn-open-presets');
const btnClosePresets = document.getElementById('btn-close-presets');
const btnSurpriseMe = document.getElementById('btn-surprise-me');
const btnShare = document.getElementById('btn-share');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingStepText = document.getElementById('loading-step-text');
const loadingFactContent = document.getElementById('loading-fact-content');

// 1. Determine Initial Preset from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const initialPresetId = urlParams.get('preset') || 'marine_drive';

// 2. Initialize Input Adapter and World Manager
const inputAdapter = new KeyboardMouseAdapter(canvas);
const worldManager = new WorldManager(canvas, inputAdapter, {
  presetId: initialPresetId,
  renderDistance: 8
});

// 3. Connect Loading Progress Events
worldManager.onLoadingStep = (stepText, fact) => {
  if (stepText) {
    loadingOverlay.classList.remove('hidden');
    loadingStepText.textContent = stepText;
    if (fact) loadingFactContent.textContent = fact;
  } else {
    // Done loading
    loadingOverlay.classList.add('hidden');
  }
};

// 4. Setup Hotbar Blocks
const HOTBAR_BLOCKS = [
  BLOCKS.TAXI_BODY,
  BLOCKS.BEST_BUS,
  BLOCKS.WHITEWASH_ART_DECO,
  BLOCKS.GOTHIC_SANDSTONE,
  BLOCKS.TETRAPOD,
  BLOCKS.CHAWL_WALL_OCHRE,
  BLOCKS.TIN_ROOF_BLUE_TARP,
  BLOCKS.SEA_WATER,
  BLOCKS.LANTERN
];

let activeHotbarIndex = 0;

function renderHotbar() {
  hotbarEl.innerHTML = '';
  HOTBAR_BLOCKS.forEach((blockId, index) => {
    const def = BLOCK_DEFS[blockId];
    const slot = document.createElement('div');
    slot.className = `hotbar-slot ${index === activeHotbarIndex ? 'active' : ''}`;
    slot.title = def ? def.name : `Block ${blockId}`;

    const num = document.createElement('span');
    num.className = 'hotbar-number';
    num.textContent = index + 1;
    slot.appendChild(num);

    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 28;
    previewCanvas.height = 28;
    previewCanvas.className = 'hotbar-icon';
    drawBlockPreview(previewCanvas, blockId);
    slot.appendChild(previewCanvas);

    slot.addEventListener('click', (e) => {
      e.stopPropagation();
      selectHotbarSlot(index);
    });

    hotbarEl.appendChild(slot);
  });
}

function selectHotbarSlot(index) {
  activeHotbarIndex = (index + HOTBAR_BLOCKS.length) % HOTBAR_BLOCKS.length;
  renderHotbar();
}

function drawBlockPreview(canvas, blockId) {
  const ctx = canvas.getContext('2d');
  const def = BLOCK_DEFS[blockId];
  if (!def) return;

  const atlas = worldManager.renderer.atlas;
  const tileName = def.faces ? (def.faces.side || def.faces.top || def.faces.all) : 'stone';
  const uv = atlas.getUV(tileName);
  if (!uv) return;

  const tx = uv.tx;
  const ty = uv.ty;
  const imgData = ctx.createImageData(28, 28);

  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const srcX = tx * 32 + Math.floor((x / 28) * 32);
      const srcY = ty * 32 + Math.floor((y / 28) * 32);
      const srcIdx = (srcY * atlas.width + srcX) * 4;
      const dstIdx = (y * 28 + x) * 4;

      imgData.data[dstIdx] = atlas.pixels[srcIdx];
      imgData.data[dstIdx + 1] = atlas.pixels[srcIdx + 1];
      imgData.data[dstIdx + 2] = atlas.pixels[srcIdx + 2];
      imgData.data[dstIdx + 3] = atlas.pixels[srcIdx + 3];
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// 5. Connect Input Actions
inputAdapter.onAction('hotbar_slot', selectHotbarSlot);
inputAdapter.onAction('hotbar_next', () => selectHotbarSlot(activeHotbarIndex + 1));
inputAdapter.onAction('hotbar_prev', () => selectHotbarSlot(activeHotbarIndex - 1));
inputAdapter.onAction('map_toggle', () => togglePresetModal());

// Pointer lock overlay toggle
document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === canvas) {
    promptEl.classList.add('hidden');
  } else {
    promptEl.classList.remove('hidden');
  }
});

// 6. Connect Realtime Stats
worldManager.onStatsCallback = (stats) => {
  fpsEl.textContent = stats.fps;
  chunksEl.textContent = stats.chunkCount;
  latlonEl.textContent = `${stats.lat.toFixed(4)}, ${stats.lon.toFixed(4)}`;
  activeLocEl.textContent = `📍 ${stats.preset.name}`;
};

// 7. Preset Modal Logic
function renderPresetGrid(filterText = '') {
  presetGrid.innerHTML = '';
  const searchLower = filterText.toLowerCase();

  const filtered = PRESETS.filter(p =>
    p.name.toLowerCase().includes(searchLower) ||
    p.subtitle.toLowerCase().includes(searchLower) ||
    (p.nameHi && p.nameHi.includes(filterText)) ||
    (p.nameMr && p.nameMr.includes(filterText))
  );

  filtered.forEach(preset => {
    const card = document.createElement('div');
    card.className = `preset-card ${preset.id === worldManager.activePreset.id ? 'active' : ''}`;
    card.innerHTML = `
      <div class="preset-card-title">${preset.name}</div>
      <div class="preset-card-subtitle">${preset.subtitle}</div>
      <div class="preset-card-meta">
        <span>${preset.nameMr || preset.nameHi || ''}</span>
        <span>Radius: ${preset.radius}m</span>
      </div>
    `;

    card.addEventListener('click', async () => {
      togglePresetModal(false);
      await loadPreset(preset.id);
    });

    presetGrid.appendChild(card);
  });
}

async function loadPreset(presetId) {
  // Update URL state
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('preset', presetId);
  window.history.replaceState({}, '', newUrl);

  await worldManager.loadLocation(presetId);
  renderPresetGrid();
}

function togglePresetModal(open = null) {
  const isOpen = presetModal.classList.contains('open');
  const targetState = open !== null ? open : !isOpen;

  if (targetState) {
    presetModal.classList.add('open');
    renderPresetGrid(searchInput.value);
    searchInput.focus();
    if (document.pointerLockElement) {
      document.exitPointerLock?.();
    }
  } else {
    presetModal.classList.remove('open');
  }
}

btnOpenPresets.addEventListener('click', (e) => {
  e.stopPropagation();
  togglePresetModal(true);
});

btnClosePresets.addEventListener('click', () => {
  togglePresetModal(false);
});

presetModal.addEventListener('click', (e) => {
  if (e.target === presetModal) {
    togglePresetModal(false);
  }
});

searchInput.addEventListener('input', (e) => {
  renderPresetGrid(e.target.value);
});

btnSurpriseMe.addEventListener('click', async () => {
  const otherPresets = PRESETS.filter(p => p.id !== worldManager.activePreset.id);
  const randomPreset = otherPresets[Math.floor(Math.random() * otherPresets.length)];
  togglePresetModal(false);
  await loadPreset(randomPreset.id);
});

// Monsoon Weather Toggle
const btnMonsoon = document.getElementById('btn-monsoon');
if (btnMonsoon) {
  btnMonsoon.addEventListener('click', (e) => {
    e.stopPropagation();
    worldManager.renderer.toggleMonsoon();
    btnMonsoon.classList.toggle('active', worldManager.renderer.isMonsoonActive);
  });
}

// Time of Day Cycle (Sunset -> Night -> Day)
const btnTime = document.getElementById('btn-time');
const timeIcon = document.getElementById('time-icon');
const timeText = document.getElementById('time-text');
const TIME_MODES = [
  { name: 'Sunset', icon: '🌅', hours: 17.5 },
  { name: 'Night', icon: '🌙', hours: 21.0 },
  { name: 'Day', icon: '☀️', hours: 12.0 }
];
let activeTimeModeIdx = 0;

if (btnTime) {
  btnTime.addEventListener('click', (e) => {
    e.stopPropagation();
    activeTimeModeIdx = (activeTimeModeIdx + 1) % TIME_MODES.length;
    const mode = TIME_MODES[activeTimeModeIdx];
    worldManager.renderer.setTimeOfDay(mode.hours);
    timeIcon.textContent = mode.icon;
    timeText.textContent = mode.name;
  });
}

// Share Spot Button
btnShare.addEventListener('click', async (e) => {
  e.stopPropagation();
  const coords = worldManager.projection.unproject(
    worldManager.camera.position.x,
    worldManager.camera.position.z
  );
  const shareUrl = `${window.location.origin}/?lat=${coords.lat.toFixed(4)}&lon=${coords.lon.toFixed(4)}&preset=${worldManager.activePreset.id}`;

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      const originalText = btnShare.innerHTML;
      btnShare.innerHTML = '<span>✅</span> Copied!';
      setTimeout(() => { btnShare.innerHTML = originalText; }, 2000);
    } else {
      prompt('Share this exact spot with link:', shareUrl);
    }
  } catch (err) {
    prompt('Share this exact spot with link:', shareUrl);
  }
});

// 8. Start Application
renderHotbar();
renderPresetGrid();
worldManager.start();

console.log('Voxel Mumbai Phase 2: OpenStreetMap real world integration online.');
