import { describe, it, expect } from 'vitest';
import { rasterizePolygon, rasterizePolyline, pointInPolygon } from '../packages/core/src/gen/polygon-rasterizer.js';

describe('Polygon & Polyline Rasterizer', () => {
  it('correctly tests point inside/outside polygon', () => {
    const square = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]];
    expect(pointInPolygon(5, 5, square)).toBe(true);
    expect(pointInPolygon(15, 5, square)).toBe(false);
    expect(pointInPolygon(-5, 5, square)).toBe(false);
  });

  it('rasterizes a 10x10 rectangular building polygon', () => {
    const square = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]];
    const cells = rasterizePolygon(square);

    // Should produce roughly 100 cells (10x10)
    expect(cells.length).toBeGreaterThanOrEqual(90);
    expect(cells.length).toBeLessThanOrEqual(110);

    // All cells should be within [0, 10] range
    for (const c of cells) {
      expect(c.x).toBeGreaterThanOrEqual(0);
      expect(c.x).toBeLessThanOrEqual(10);
      expect(c.z).toBeGreaterThanOrEqual(0);
      expect(c.z).toBeLessThanOrEqual(10);
    }
  });

  it('excludes interior courtyard hole cells', () => {
    // 20x20 building with a 10x10 central courtyard hole
    const exterior = [[0, 0], [20, 0], [20, 20], [0, 20], [0, 0]];
    const hole = [[5, 5], [15, 5], [15, 15], [5, 15], [5, 5]];

    const cellsWithHole = rasterizePolygon(exterior, [hole]);
    const cellsWithoutHole = rasterizePolygon(exterior);

    expect(cellsWithHole.length).toBeLessThan(cellsWithoutHole.length);

    // Verify no cell is inside the courtyard
    for (const c of cellsWithHole) {
      const inCourtyard = (c.x >= 6 && c.x <= 14 && c.z >= 6 && c.z <= 14);
      expect(inCourtyard).toBe(false);
    }
  });

  it('rasterizes polyline road with width into continuous grid cells', () => {
    const line = [[0, 0], [20, 0]];
    const roadCells = rasterizePolyline(line, 4);

    expect(roadCells.length).toBeGreaterThan(0);
    // Along x in [0..20], z should be around 0 within half-width of 2
    for (const c of roadCells) {
      expect(c.x).toBeGreaterThanOrEqual(-2);
      expect(c.x).toBeLessThanOrEqual(22);
      expect(Math.abs(c.z)).toBeLessThanOrEqual(2);
    }
  });
});
