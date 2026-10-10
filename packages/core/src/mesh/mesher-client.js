/**
 * Voxel Mumbai - Mesher Client & Worker Pool
 * Manages worker pool, priority queue (nearest chunk first),
 * and handles geometry buffer generation.
 */

import { meshChunk } from './greedy-mesher.js';

export class MesherClient {
  /**
   * @param {Object} uvMap - Atlas UV mapping dictionary
   * @param {number} [workerCount=4]
   */
  constructor(uvMap, workerCount = 2) {
    this.uvMap = uvMap;
    this.workers = [];
    this.idleWorkers = [];
    this.workerCount = typeof navigator !== 'undefined' ? Math.min(4, Math.max(2, (navigator.hardwareConcurrency || 4) - 1)) : workerCount;
    this.taskQueue = [];
    this.activeTasks = new Map();
    this.taskIdCounter = 0;
    this.initWorkers();
  }

  initWorkers() {
    if (typeof Worker === 'undefined') return;

    for (let i = 0; i < this.workerCount; i++) {
      try {
        const worker = new Worker(new URL('./mesher.worker.js', import.meta.url), {
          type: 'module'
        });

        worker.onmessage = (e) => {
          this.onWorkerMessage(worker, e.data);
        };

        worker.onerror = (err) => {
          console.error('Mesher worker error:', err);
          this.returnWorker(worker);
        };

        this.workers.push(worker);
        this.idleWorkers.push(worker);
      } catch (err) {
        console.warn('Could not spawn Web Worker, falling back to main-thread meshing:', err);
        break;
      }
    }
  }

  returnWorker(worker) {
    if (!this.idleWorkers.includes(worker)) {
      this.idleWorkers.push(worker);
    }
    this.drainQueue();
  }

  onWorkerMessage(worker, data) {
    const { id, cx, cz, result } = data;
    const task = this.activeTasks.get(id);
    if (task) {
      this.activeTasks.delete(id);
      task.resolve(result);
    }
    this.returnWorker(worker);
  }

  /**
   * Schedules a chunk for meshing with distance priority
   * @param {number} cx
   * @param {number} cz
   * @param {Uint16Array} chunkVoxels
   * @param {Object} neighbors
   * @param {number} priority - lower value = higher priority (e.g. distance to camera)
   * @returns {Promise<Object>}
   */
  scheduleChunk(cx, cz, chunkVoxels, neighbors, priority = 0) {
    return new Promise((resolve, reject) => {
      // If workers are not available, run synchronously on main thread
      if (this.workers.length === 0) {
        try {
          const res = meshChunk(chunkVoxels, neighbors, this.uvMap);
          resolve(res);
        } catch (e) {
          reject(e);
        }
        return;
      }

      const task = {
        id: ++this.taskIdCounter,
        cx,
        cz,
        chunkVoxels,
        neighbors,
        priority,
        resolve,
        reject
      };

      this.taskQueue.push(task);
      // Sort priority queue: nearest first
      this.taskQueue.sort((a, b) => a.priority - b.priority);
      this.drainQueue();
    });
  }

  drainQueue() {
    while (this.idleWorkers.length > 0 && this.taskQueue.length > 0) {
      const worker = this.idleWorkers.pop();
      const task = this.taskQueue.shift();

      this.activeTasks.set(task.id, task);

      // Clone voxels for transfer
      const voxelsCopy = new Uint16Array(task.chunkVoxels.length);
      voxelsCopy.set(task.chunkVoxels);

      const transferables = [voxelsCopy.buffer];

      // Clone neighbors if provided
      const neighborsPayload = {};
      if (task.neighbors) {
        for (const dir of ['px', 'nx', 'pz', 'nz']) {
          if (task.neighbors[dir]) {
            const nCopy = new Uint16Array(task.neighbors[dir].length);
            nCopy.set(task.neighbors[dir]);
            neighborsPayload[dir] = nCopy;
            transferables.push(nCopy.buffer);
          }
        }
      }

      worker.postMessage(
        {
          id: task.id,
          cx: task.cx,
          cz: task.cz,
          chunkVoxels: voxelsCopy,
          neighbors: neighborsPayload,
          uvMap: this.uvMap
        },
        transferables
      );
    }
  }

  destroy() {
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.idleWorkers = [];
    this.taskQueue = [];
    this.activeTasks.clear();
  }
}
