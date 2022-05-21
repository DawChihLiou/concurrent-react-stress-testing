import { useFrame, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { TextureLoader, Mesh } from 'three';

export default function Sphere(props: JSX.IntrinsicElements['mesh']) {
  const mesh = useRef<Mesh>(null!);
  const texture = useLoader(TextureLoader, 'https://i.imgur.com/45naBE9.jpg');

  useFrame((state, delta) => {
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh {...props} ref={mesh} scale={1}>
      <sphereGeometry args={[1, 40, 30]} />
      <meshPhongMaterial map={texture} />
    </mesh>
  );
}
