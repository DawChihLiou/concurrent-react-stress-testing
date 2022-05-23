import { Vector3, CubicBezierCurve3 } from 'three';
import { clamp } from './math';
import { geoInterpolate } from 'd3-geo';

const DEGREE_TO_RADIAN = Math.PI / 180;

function calculatePosition(lat: number, lng: number, radius: number): Vector3 {
  const phi = (90 - lat) * DEGREE_TO_RADIAN;
  const theta = (lng + 180) * DEGREE_TO_RADIAN;

  return new Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function calculateSpline([
  startLat,
  startLng,
  endLat,
  endLng,
]: number[]) {
  const start = calculatePosition(startLat, startLng, 2);
  const end = calculatePosition(endLat, endLng, 2);
  const altitude = clamp(start.distanceTo(end) * 0.75, 6, 16);
  const interpolate = geoInterpolate([startLng, startLat], [endLng, endLat]);

  const midCoord1 = interpolate(0.25);
  const midCoord2 = interpolate(0.75);

  const mid1 = calculatePosition(midCoord1[1], midCoord1[0], 2 + altitude);
  const mid2 = calculatePosition(midCoord2[1], midCoord2[0], 2 + altitude);

  return {
    start,
    end,
    spline: new CubicBezierCurve3(start, mid1, mid2, end),
  };
}
