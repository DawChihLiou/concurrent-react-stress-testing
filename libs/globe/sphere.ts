import { MeshPhongMaterial, TextureLoader, SphereGeometry, Mesh } from 'three';
import { GLOBE_RADIUS } from './constants';
import { rootMesh } from './scene';

const COLOR_SPHERE_NIGHT = 0xa58945;

export function init() {
  const geometry = new SphereGeometry(GLOBE_RADIUS, 40, 30);
  const loader = new TextureLoader();
  const material = new MeshPhongMaterial({
    map: loader.load('https://i.imgur.com/45naBE9.jpg'),
    color: COLOR_SPHERE_NIGHT,
  });
  const mesh = new Mesh(geometry, material);

  rootMesh.add(mesh);
}
