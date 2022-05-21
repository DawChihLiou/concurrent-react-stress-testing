import { init as initScene } from './scene';
import { init as initSphere } from './sphere';

export function initGlobe(container: HTMLElement | null) {
  if (container === null) {
    return;
  }
  initScene(container);
  initSphere();
}
