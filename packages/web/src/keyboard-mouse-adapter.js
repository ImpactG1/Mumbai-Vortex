/**
 * Voxel Mumbai - Desktop Web Keyboard & Mouse Adapter
 * Translates DOM keyboard and mouse events into InputAdapter commands.
 */

import { InputAdapter } from '../../core/src/input/input-adapter.js';

export class KeyboardMouseAdapter extends InputAdapter {
  /**
   * @param {HTMLElement} domElement - usually the canvas
   */
  constructor(domElement) {
    super();
    this.domElement = domElement;

    this.keys = new Set();
    this.deltaX = 0;
    this.deltaY = 0;
    this.mouseSensitivity = 0.0022;

    this.isPointerLocked = false;
    this.isMouseDown = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.setupListeners();
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      // Don't capture keys if typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      this.keys.add(e.code);

      // Trigger actions
      if (e.code === 'KeyF') this.emitAction('toggle_flight');
      if (e.code === 'KeyP') this.emitAction('photo_mode');
      if (e.code === 'KeyM') this.emitAction('map_toggle');
      if (e.code === 'KeyE') this.emitAction('inventory_toggle');
      if (e.code === 'KeyT') this.emitAction('search_toggle');

      // Hotbar 1-9
      if (e.code.startsWith('Digit') && e.code.length === 6) {
        const slot = parseInt(e.code.slice(5), 10);
        if (slot >= 1 && slot <= 9) {
          this.emitAction('hotbar_slot', slot - 1);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    // Pointer lock handling
    this.domElement.addEventListener('click', () => {
      if (!this.isPointerLocked && document.pointerLockElement !== this.domElement) {
        this.domElement.requestPointerLock?.();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = (document.pointerLockElement === this.domElement);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPointerLocked) {
        this.deltaX += e.movementX * this.mouseSensitivity;
        this.deltaY += e.movementY * this.mouseSensitivity;
      } else if (this.isMouseDown) {
        // Fallback drag-to-look when pointer lock isn't engaged
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        this.deltaX += dx * this.mouseSensitivity;
        this.deltaY += dy * this.mouseSensitivity;
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
      }
    });

    this.domElement.addEventListener('mousedown', (e) => {
      this.isMouseDown = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      if (e.button === 0) {
        this.emitAction('action_primary'); // Break block
      } else if (e.button === 2) {
        e.preventDefault();
        this.emitAction('action_secondary'); // Place block
      }
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    this.domElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Mouse scroll for hotbar
    this.domElement.addEventListener('wheel', (e) => {
      if (e.deltaY > 0) {
        this.emitAction('hotbar_next');
      } else if (e.deltaY < 0) {
        this.emitAction('hotbar_prev');
      }
    }, { passive: true });
  }

  getMoveVector() {
    let forward = 0;
    let right = 0;
    let up = 0;

    // Forward/Backward (W/S)
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) forward += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) forward -= 1;

    // Strafe Left/Right (A/D)
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) right += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) right -= 1;

    // Vertical Up/Down (Space / Shift or Ctrl)
    if (this.keys.has('Space')) up += 1;
    if (this.keys.has('ControlLeft') || this.keys.has('KeyC')) up -= 1;

    return {
      x: right,
      y: up,
      z: -forward // in camera coords, -z is forward
    };
  }

  getLookDelta() {
    return {
      dx: this.deltaX,
      dy: this.deltaY
    };
  }

  isActionActive(actionName) {
    if (actionName === 'sprint') {
      return this.keys.has('ShiftLeft') || this.keys.has('ShiftRight');
    }
    if (actionName === 'crouch') {
      return this.keys.has('ControlLeft') || this.keys.has('KeyC');
    }
    return false;
  }

  resetDeltas() {
    this.deltaX = 0;
    this.deltaY = 0;
  }
}
