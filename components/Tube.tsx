import { calculateSpline } from '../utils/geo';
import { AdditiveBlending } from 'three';
import { memo } from 'react';

const CURVE_SEGMENTS = 32;
const TUBE_RADIUS_SEGMENTS = 2;
const DEFAULT_TUBE_RADIUS = 0.01;
const DRAW_RANGE_DELTA = 16;
const MAX_DRAW_RANGE = DRAW_RANGE_DELTA * CURVE_SEGMENTS;

type TubeProps = {
  coords: number[];
};

function Tube({ coords }: TubeProps) {
  const { spline } = calculateSpline(coords);

  return (
    <mesh>
      <tubeBufferGeometry
        args={[
          spline,
          CURVE_SEGMENTS,
          DEFAULT_TUBE_RADIUS,
          TUBE_RADIUS_SEGMENTS,
          false,
        ]}
        drawRange={{ start: 0, count: MAX_DRAW_RANGE }}
      />
      <meshBasicMaterial
        blending={AdditiveBlending}
        opacity={0.6}
        transparent
        color="#e43c59"
      />
    </mesh>
  );
}

export default memo(Tube);
