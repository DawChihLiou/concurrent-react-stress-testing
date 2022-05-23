import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function Sphere(props: JSX.IntrinsicElements['mesh']) {
  const texture = useLoader(TextureLoader, 'https://i.imgur.com/45naBE9.jpg');

  return (
    <mesh {...props} scale={1}>
      <sphereGeometry args={[2, 32, 16]} />
      <meshPhongMaterial map={texture} />
    </mesh>
  );
}
