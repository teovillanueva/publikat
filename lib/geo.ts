import { Point } from "geojson";

export function getBboxFromPoints(points: Point[], padding: number) {
  const xs = points.map((p) => p.coordinates[0]);
  const ys = points.map((p) => p.coordinates[1]);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return [minX - padding, minY - padding, maxX + padding, maxY + padding] as [
    number,
    number,
    number,
    number
  ];
}
