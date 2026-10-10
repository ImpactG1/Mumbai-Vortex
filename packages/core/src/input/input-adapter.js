/**
 * Voxel Mumbai - Abstract Input Adapter Interface
 * Engine core remains 100% decoupled from DOM, Keyboard, Mouse, and Touch APIs.
 */

export class InputAdapter {
  constructor() {
    this.actionListeners = new Map();
  }

  /**
   * Returns current movement intention in local space
   * @returns {{ x: number, y: number, z: number }} x: strafe right(+)/left(-), y: up(+)/down(-), z: forward(-)/back(+)
   */
  getMoveVector() {
    return { x: 0, y: 0, z: 0 };
  }

  /**
   * Returns look rotation deltas in radians since last frame
   * @returns {{ dx: number, dy: number }} dx: yaw change, dy: pitch change
   */
  getLookDelta() {
    return { dx: 0, dy: 0 };
  }

  /**
   * Checks if an action is currently pressed
   * @param {string} actionName
   * @returns {boolean}
   */
  isActionActive(actionName) {
    return false;
  }

  /**
   * Registers a callback for discrete action triggers (e.g. 'jump', 'toggle_flight', 'break', 'place')
   * @param {string} actionName
   * @param {Function} callback
   */
  onAction(actionName, callback) {
    if (!this.actionListeners.has(actionName)) {
      this.actionListeners.set(actionName, []);
    }
    this.actionListeners.get(actionName).push(callback);
  }

  /**
   * Emits an action event to registered callbacks
   * @param {string} actionName
   * @param {any} [payload]
   */
  emitAction(actionName, payload = null) {
    const list = this.actionListeners.get(actionName);
    if (list) {
      for (const cb of list) {
        cb(payload);
      }
    }
  }

  /**
   * Resets frame-accumulated deltas
   */
  resetDeltas() {}
}
