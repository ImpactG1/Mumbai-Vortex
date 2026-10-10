/**
 * Voxel Mumbai - High Performance Polygon & Polyline Rasterizer
 * Used to rasterize OSM building polygons (with courtyard holes) and road ribbons
 * into discrete (x, z) block footprints.
 */

/**
 * Tests if point (x, z) is inside a 2D polygon ring using ray casting.
 * @param {number} x
 * @param {number} z
 * @param {Array<[number, number]>} ring - array of [px, pz]
 * @returns {boolean}
 */
export function pointInPolygon(x, z, ring) {
  let inside = false;
  const len = ring.length;
  for (let i = 0, j = len - 1; i < len; j = i++) {
    const xi = ring[i][0], zi = ring[i][1];
    const xj = ring[j][0], zj = ring[j][1];

    const intersect = ((zi > z) !== (zj > z)) &&
      (x < (xj - xi) * (z - zi) / (zj - zi + 0.0000001) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Scanline rasterizer for a 2D polygon with optional hole rings.
 * @param {Array<[number, number]>} exteriorRing - [[x, z], ...]
 * @param {Array<Array<[number, number]>>} [interiorRings=[]] - array of hole rings
 * @returns {Array<{x: number, z: number}>} array of integer grid cells
 */
export function rasterizePolygon(exteriorRing, interiorRings = []) {
  if (!exteriorRing || exteriorRing.length < 3) return [];

  // Compute bounding box
  let minX = Infinity, maxX = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (const [x, z] of exteriorRing) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  const startX = Math.floor(minX);
  const endX = Math.ceil(maxX);
  const startZ = Math.floor(minZ);
  const endZ = Math.ceil(maxZ);

  const cells = [];
  const len = exteriorRing.length;

  // Scanline along Z
  for (let z = startZ; z <= endZ; z++) {
    const sampleZ = z + 0.5;
    const intersections = [];

    for (let i = 0, j = len - 1; i < len; j = i++) {
      const p1 = exteriorRing[i];
      const p2 = exteriorRing[j];

      if ((p1[1] <= sampleZ && p2[1] > sampleZ) || (p2[1] <= sampleZ && p1[1] > sampleZ)) {
        const x = p1[0] + ((sampleZ - p1[1]) / (p2[1] - p1[1])) * (p2[0] - p1[0]);
        intersections.push(x);
      }
    }

    intersections.sort((a, b) => a - b);

    // Fill between paired intersections
    for (let k = 0; k < intersections.length; k += 2) {
      if (k + 1 >= intersections.length) break;
      const xStart = Math.ceil(intersections[k]);
      const xEnd = Math.floor(intersections[k + 1]);

      for (let x = xStart; x <= xEnd; x++) {
        // Check if inside any interior hole
        let inHole = false;
        for (const hole of interiorRings) {
          if (pointInPolygon(x + 0.5, sampleZ, hole)) {
            inHole = true;
            break;
          }
        }
        if (!inHole) {
          cells.push({ x, z });
        }
      }
    }
  }

  return cells;
}

/**
 * Rasterizes a polyline into a road ribbon of specified width in blocks.
 * @param {Array<[number, number]>} points - [[x, z], ...]
 * @param {number} width - width in metres / blocks
 * @returns {Array<{x: number, z: number, distAlong: number, heading: number}>}
 */
export function rasterizePolyline(points, width) {
  if (!points || points.length < 2) return [];

  const halfWidth = Math.max(0.5, width / 2);
  const halfWidthSq = halfWidth * halfWidth;
  const cellMap = new Map();

  for (let i = 0; i < points.length - 1; i++) {
    const [x0, z0] = points[i];
    const [x1, z1] = points[i + 1];

    const dx = x1 - x0;
    const dz = z1 - z0;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.001) continue;

    const heading = Math.atan2(dx, -dz); // heading angle

    const minX = Math.floor(Math.min(x0, x1) - halfWidth);
    const maxX = Math.ceil(Math.max(x0, x1) + halfWidth);
    const minZ = Math.floor(Math.min(z0, z1) - halfWidth);
    const maxZ = Math.ceil(Math.max(z0, z1) + halfWidth);

    for (let z = minZ; z <= maxZ; z++) {
      for (let x = minX; x <= maxX; x++) {
        // Distance from point (x+0.5, z+0.5) to line segment (x0,z0)-(x1,z1)
        const px = x + 0.5;
        const pz = z + 0.5;

        const t = Math.max(0, Math.min(1, ((px - x0) * dx + (pz - z0) * dz) / (len * len)));
        const projX = x0 + t * dx;
        const projZ = z0 + t * dz;

        const distSq = (px - projX) * (px - projX) + (pz - projZ) * (pz - projZ);
        if (distSq <= halfWidthSq) {
          const key = `${x},${z}`;
          if (!cellMap.has(key)) {
            cellMap.set(key, { x, z, heading });
          }
        }
      }
    }
  }

  return Array.from(cellMap.values());
}
