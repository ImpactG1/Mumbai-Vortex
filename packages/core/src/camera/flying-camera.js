/**
 * Voxel Mumbai - Flying Camera Controller
 * Manages 6-DOF free-flight camera navigation using the InputAdapter.
 */

import * as THREE from 'three';

export class FlyingCamera {
  /**
   * @param {THREE.Camera} camera
   * @param {import('../input/input-adapter.js').InputAdapter} inputAdapter
   * @param {Object} [options]
   */
  constructor(camera, inputAdapter, options = {}) {
    this.camera = camera;
    this.input = inputAdapter;
    this.speed = options.speed || 24.0; // metres per second
    this.sprintMultiplier = options.sprintMultiplier || 2.5;

    this.position = new THREE.Vector3(options.x || 0, options.y || 45, options.z || 0);
    this.yaw = options.yaw || 0; // rotation around Y in radians
    this.pitch = options.pitch || -0.2; // look up/down in radians

    this.forward = new THREE.Vector3();
    this.right = new THREE.Vector3();
    this.up = new THREE.Vector3(0, 1, 0);

    this.updateCameraTransform();
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
    this.updateCameraTransform();
  }

  setRotation(yaw, pitch) {
    this.yaw = yaw;
    this.pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch));
    this.updateCameraTransform();
  }

  /**
   * Updates camera position and rotation based on input
   * @param {number} dt - delta time in seconds
   */
  update(dt) {
    // 1. Look rotation
    const look = this.input.getLookDelta();
    if (look.dx !== 0 || look.dy !== 0) {
      this.yaw -= look.dx;
      this.pitch -= look.dy;
      // Clamp pitch to avoid flipping
      const maxPitch = Math.PI / 2 - 0.02;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
    }

    // 2. Vectors in world space
    this.forward.set(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch)
    ).normalize();

    this.right.set(
      Math.cos(this.yaw),
      0,
      -Math.sin(this.yaw)
    ).normalize();

    // 3. Movement
    const move = this.input.getMoveVector();
    let currentSpeed = this.speed;
    if (this.input.isActionActive('sprint')) {
      currentSpeed *= this.sprintMultiplier;
    }

    // move.z: -1 forward, +1 backward
    // move.x: +1 right, -1 left
    // move.y: +1 up, -1 down
    const velocity = new THREE.Vector3();
    if (move.z !== 0) {
      velocity.addScaledVector(this.forward, -move.z * currentSpeed * dt);
    }
    if (move.x !== 0) {
      velocity.addScaledVector(this.right, move.x * currentSpeed * dt);
    }
    if (move.y !== 0) {
      velocity.addScaledVector(this.up, move.y * currentSpeed * dt);
    }

    this.position.add(velocity);
    this.updateCameraTransform();

    // Reset accumulated deltas
    this.input.resetDeltas();
  }

  updateCameraTransform() {
    this.camera.position.copy(this.position);

    // Compute look target
    const target = this.position.clone().add(
      new THREE.Vector3(
        -Math.sin(this.yaw) * Math.cos(this.pitch),
        Math.sin(this.pitch),
        -Math.cos(this.yaw) * Math.cos(this.pitch)
      )
    );
    this.camera.lookAt(target);
  }
}
