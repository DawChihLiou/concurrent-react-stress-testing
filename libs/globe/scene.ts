import * as three from 'three';
import { PI_TWO } from './constants';
import { Camera, PerspectiveCamera, WebGLRenderer } from 'three';
import Hammer from 'hammerjs';

const CAMERA_Z_MIN = 800;
const CAMERA_Z_MAX = 1300;

let deltaX = 0;
let deltaY = 0;

let startX = 0;
let startY = 0;

let cameraZ = 1100;

export const scene = new three.Scene();

export const rootMesh = new three.Mesh(new three.BufferGeometry());

export function init(container: HTMLElement) {
  const width = container.offsetWidth || window.innerWidth;
  const height = container.offsetHeight || window.innerHeight;

  const camera = new three.PerspectiveCamera(30, width / height, 1, 10000);
  const renderer = new three.WebGLRenderer({ antialias: true });

  // animation
  const play = () => {
    rootMesh.rotation.x += Math.atan(deltaY / cameraZ) * 0.2;
    rootMesh.rotation.y += Math.atan(deltaX / cameraZ) * 0.2;

    if (rootMesh.rotation.x > PI_TWO) {
      rootMesh.rotation.x -= PI_TWO;
    }
    if (rootMesh.rotation.y > PI_TWO) {
      rootMesh.rotation.y -= PI_TWO;
    }

    //zoom
    camera.position.z = cameraZ;

    // render
    renderer.render(scene, camera);

    // next frame
    requestAnimationFrame(play);
  };

  // init scene
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);
  camera.position.z = cameraZ;

  // add root mesh to the scene
  scene.add(rootMesh);

  // add lighting
  const light = new three.HemisphereLight(0xffffff, 0xffffff, 3);
  scene.add(light);

  initPanListener(container);
  initResizeListener(container, camera, renderer);

  play();
}

function initResizeListener(
  container: HTMLElement,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
) {
  window.addEventListener('resize', () => {
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });
}

function initPanListener(container: HTMLElement) {
  const mc = new Hammer.Manager(container);
  const reset = () => {
    deltaX = 0;
    deltaY = 0;
    startX = 0;
    startY = 0;
  };

  mc.add(new Hammer.Pan());

  mc.on('pan', (e) => {
    deltaX = e.deltaX - startX;
    deltaY = e.deltaY - startY;
  });

  mc.on('panstart', () => {
    reset();
    container.style.cursor = 'move';
  });

  mc.on('panend', () => {
    reset();
    container.style.cursor = 'auto';
  });
}
