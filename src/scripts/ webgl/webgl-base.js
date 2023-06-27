import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  MathUtils,
  AmbientLight,
  Color,
  GridHelper,
  AxesHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class WebglBase {
  constructor(canvas) {
    this.renderParam = {
      canvas: canvas,
      alpha: true,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.cameraParam = {
      fov: 0,
      near: 0.1,
      far: 1000,
      lookAt: new Vector3(0, 0, 0),
      x: 0,
      y: 0,
      z: 20,
    };

    this.clearColor = 0xade2d1;
    this.dpr = 1.0;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.isInitialized = false;
    this.renderTarget = null;
    this.orbitcontrols = null;

    this._baseSetUp();
  }

  _baseSetUp() {
    this._baseSetScene();
    this._baseSetRender();
    this._baseSetCamera();

    this.orbitcontrols = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitcontrols.enableDamping = true;
    this.orbitcontrols.autoRotate = true;

    const light = new AmbientLight(0xffffff, 5.0);
    this.scene.add(light);

    this.scene.add(new GridHelper(5000, 100));
    this.scene.add(new AxesHelper(500));
  }

  _baseSetScene() {
    this.scene = new Scene();
  }

  _baseSetRender() {
    this.renderer = new WebGLRenderer({
      canvas: this.renderParam.canvas,
      alpha: this.renderParam.alpha,
      antialias: false,
      depth: false,
    });
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setClearColor(new Color(this.clearColor));
    this.renderer.setSize(this.renderParam.width, this.renderParam.height);
  }

  _baseSetCamera() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (!this.isInitialized) {
      this.camera = new PerspectiveCamera(
        45,
        width / height,
        this.cameraParam.near,
        this.cameraParam.far
      );

      this.camera.position.set(
        this.cameraParam.x,
        this.cameraParam.y,
        this.cameraParam.z
      );
      this.camera.lookAt(this.cameraParam.lookAt);
      this.isInitialized = true;
    }
    this.camera.aspect = width / height;
    // this.camera.fov =
    //   MathUtils.radToDeg(
    //     Math.atan(width / this.camera.aspect / (2 * this.camera.position.z))
    //   ) * 2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onResize() {
    this._baseSetCamera();
  }
}
