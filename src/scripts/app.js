import { Plane } from "./ webgl/plane.js";
import { gsap } from "gsap";

export const App = () => {
  const canvas = document.querySelector('[data-el="webgl"] canvas');
  const plane = new Plane(canvas);

  // Init
  plane.init();

  // RAF
  const _raf = () => {
    plane.onRaf();
  };
  gsap.ticker.add(_raf);

  // Resize
  window.addEventListener("resize", () => {
    plane.onResize();
  });
};
