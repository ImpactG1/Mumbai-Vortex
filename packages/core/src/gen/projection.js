/**
 * Voxel Mumbai - Projection Utilities
 * Converts latitude / longitude (WGS84) to local tangent Cartesian coordinates (in metres)
 * centered on a chosen origin using an Equirectangular projection.
 * Highly accurate within a 5-10 km radius of Mumbai (lat ~18.9° to 19.3° N).
 */

const EARTH_RADIUS = 6378137.0; // WGS84 equatorial radius in metres
const DEG_TO_RAD = Math.PI / 180.0;
const RAD_TO_DEG = 180.0 / Math.PI;

export class EquirectangularProjection {
  /**
   * @param {number} originLat - center latitude in degrees
   * @param {number} originLon - center longitude in degrees
   */
  constructor(originLat, originLon) {
    this.originLat = originLat;
    this.originLon = originLon;
    this.cosLat = Math.cos(originLat * DEG_TO_RAD);
  }

  /**
   * Projects (lat, lon) to local (x, z) coordinates in metres.
   * +X points East, -X points West.
   * -Z points North, +Z points South (standard 3D graphics coordinate convention).
   * @param {number} lat
   * @param {number} lon
   * @returns {{ x: number, z: number }}
   */
  project(lat, lon) {
    const x = (lon - this.originLon) * DEG_TO_RAD * EARTH_RADIUS * this.cosLat;
    const z = -(lat - this.originLat) * DEG_TO_RAD * EARTH_RADIUS;
    return { x, z };
  }

  /**
   * Unprojects local (x, z) coordinates in metres back to (lat, lon).
   * @param {number} x
   * @param {number} z
   * @returns {{ lat: number, lon: number }}
   */
  unproject(x, z) {
    const lon = this.originLon + (x / (EARTH_RADIUS * this.cosLat)) * RAD_TO_DEG;
    const lat = this.originLat - (z / EARTH_RADIUS) * RAD_TO_DEG;
    return { lat, lon };
  }

  /**
   * Computes geographic bounding box [south, west, north, east] for a given radius in metres.
   * @param {number} radiusMeters
   * @returns {[number, number, number, number]} [minLat, minLon, maxLat, maxLon]
   */
  getBoundingBox(radiusMeters) {
    const dLat = (radiusMeters / EARTH_RADIUS) * RAD_TO_DEG;
    const dLon = (radiusMeters / (EARTH_RADIUS * this.cosLat)) * RAD_TO_DEG;
    return [
      this.originLat - dLat,
      this.originLon - dLon,
      this.originLat + dLat,
      this.originLon + dLon
    ];
  }
}
