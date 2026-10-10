import { describe, it, expect } from 'vitest';
import { EquirectangularProjection } from '../packages/core/src/gen/projection.js';

describe('Equirectangular Projection', () => {
  // Mumbai Gateway of India coordinates
  const originLat = 18.9220;
  const originLon = 72.8347;
  const proj = new EquirectangularProjection(originLat, originLon);

  it('projects the origin to (0, 0)', () => {
    const { x, z } = proj.project(originLat, originLon);
    expect(Math.abs(x)).toBeLessThan(0.001);
    expect(Math.abs(z)).toBeLessThan(0.001);
  });

  it('unprojects (0, 0) back to the origin coordinates', () => {
    const { lat, lon } = proj.unproject(0, 0);
    expect(lat).toBeCloseTo(originLat, 6);
    expect(lon).toBeCloseTo(originLon, 6);
  });

  it('performs an accurate round-trip conversion for nearby Mumbai coordinates', () => {
    // Marine Drive offset (~1.5 km west, ~500m north)
    const testLat = 18.9265;
    const testLon = 72.8228;

    const { x, z } = proj.project(testLat, testLon);
    const roundTrip = proj.unproject(x, z);

    expect(roundTrip.lat).toBeCloseTo(testLat, 6);
    expect(roundTrip.lon).toBeCloseTo(testLon, 6);
  });

  it('generates a bounding box that encompasses the requested radius', () => {
    const radiusMeters = 500;
    const [minLat, minLon, maxLat, maxLon] = proj.getBoundingBox(radiusMeters);

    expect(minLat).toBeLessThan(originLat);
    expect(maxLat).toBeGreaterThan(originLat);
    expect(minLon).toBeLessThan(originLon);
    expect(maxLon).toBeGreaterThan(originLon);

    // Points at bounding box edges should project to approximately radiusMeters
    const northPt = proj.project(maxLat, originLon);
    expect(Math.abs(-northPt.z)).toBeCloseTo(radiusMeters, 1);
  });
});
