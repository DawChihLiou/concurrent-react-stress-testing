import { useRef, useEffect, useState, memo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import randomColor from 'randomcolor';

type ParticlesProps = {
  vertices?: number[];
};

function Particles({ vertices = [] }: ParticlesProps) {
  const geometry = useRef<BufferGeometry>(null);
  const [color, setColor] = useState('#888888');

  useEffect(() => {
    geometry.current?.setAttribute(
      'position',
      new Float32BufferAttribute(vertices, 3),
    );
    setColor(randomColor());
  }, [vertices]);

  return (
    <mesh>
      <points>
        <bufferGeometry ref={geometry} />
        <pointsMaterial color={color} />
      </points>
    </mesh>
  );
}

export default memo(Particles);
