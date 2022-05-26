import { memo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Sphere from '../Sphere';
import Particles from '../Particles';
import Tube from '../Tube';

type CurveCoordinates = {
  origin: number[];
  destinations: {
    id: string;
    coordinates: number[];
  }[];
};

type SceneProps = {
  curveCoordinates?: CurveCoordinates;
  vertices?: number[];
};

function Scene({ vertices = [], curveCoordinates }: SceneProps) {
  return (
    <Canvas>
      <OrbitControls />
      <hemisphereLight args={['#ffffff', '#ffffff', 3]} />
      <Sphere position={[0, 0, 0]} />
      {curveCoordinates && (
        <mesh>
          {curveCoordinates.destinations.map((dest) => (
            <Tube
              key={dest.id}
              coords={[...curveCoordinates.origin, ...dest.coordinates]}
            />
          ))}
        </mesh>
      )}
      <Particles vertices={vertices} />
    </Canvas>
  );
}

export default memo(Scene);
