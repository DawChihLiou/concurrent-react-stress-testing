import { useRef, useEffect, useTransition, useState, memo } from 'react';
import { BufferGeometry, MathUtils, Float32BufferAttribute } from 'three';
import randomColor from 'randomcolor';

type ParticleProps = {
  trigger?: string | number | boolean;
};

function Particle({ trigger }: ParticleProps) {
  const geometry = useRef<BufferGeometry>(null);
  const [color, setColor] = useState('#888888');
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      const vertices = [];

      for (let i = 0; i < 100_000; i++) {
        const x = MathUtils.randFloatSpread(2000);
        const y = MathUtils.randFloatSpread(2000);
        const z = MathUtils.randFloatSpread(2000);

        vertices.push(x, y, z);
      }

      geometry.current?.setAttribute(
        'position',
        new Float32BufferAttribute(vertices, 3),
      );

      setColor(randomColor());
    });
  }, [trigger]);

  return (
    <mesh>
      <points>
        <bufferGeometry ref={geometry} />
        <pointsMaterial color={color} />
      </points>
    </mesh>
  );
}

export default memo(Particle);
