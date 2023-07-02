import { Scene, PerspectiveCamera, WebGLRenderer, Vector3, AmbientLight, DirectionalLight, Color, GridHelper, AxesHelper, ACESFilmicToneMapping } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class WebglBase {
  constructor(canvas) {
    this.renderParam = {
      canvas: canvas,
      alpha: false,
      width: window.innerWidth,
      height: window.innerHeight,
      color: 0xade2d1,
      antialias: true,
      exposure: 2.5,
      useLegacyLights: false,
    };
    this.cameraParam = {
      fov: 60,
      near: 0.1,
      far: 2000,
      lookAt: new Vector3(0, 0, 0),
      x: 0,
      y: 0,
      z: 1,
    };

    this.dpr = 2.0;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.isInitialized = false;
    this.renderTarget = null;
    this.orbitcontrols = null;
    this.ambientLight = null;
    this.directionalLight = null;

    this._baseSetUp();
  }

  _baseSetUp() {
    this._baseSetScene();
    this._baseSetRender();
    this._baseSetCamera();
    this._baseSetLight();
  }

  _baseSetScene() {
    this.scene = new Scene();
  }

  _baseSetRender() {
    this.renderer = new WebGLRenderer({
      canvas: this.renderParam.canvas,
      alpha: this.renderParam.alpha,
      antialias: this.renderParam.antialias,
    });
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setClearColor(new Color(this.renderParam.color));
    this.renderer.setSize(this.renderParam.width, this.renderParam.height);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = this.renderParam.exposure;
    this.renderer.useLegacyLights = this.renderParam.useLegacyLights;
  }

  _baseSetCamera() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (!this.isInitialized) {
      this.camera = new PerspectiveCamera(this.cameraParam.fov, width / height, this.cameraParam.near, this.cameraParam.far);

      this.camera.position.set(this.cameraParam.x, this.cameraParam.y, this.cameraParam.z);
      this.camera.lookAt(this.cameraParam.lookAt);

      this.orbitcontrols = new OrbitControls(this.camera, this.renderer.domElement);
      this.orbitcontrols.enableDamping = true;

      this.isInitialized = true;
    }
    const fovRad = (this.cameraParam.fov / 2) * (Math.PI / 180);
    const dist = height / 2 / Math.tan(fovRad);
    this.camera.position.z = dist;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  _baseSetLight() {
    this.ambientLight = new AmbientLight(0xffffff, 5.0);
    this.scene.add(this.ambientLight);

    this.directionalLight = new DirectionalLight(0xffffff, 2.5);
    this.scene.add(this.directionalLight);
  }

  onResize() {
    this._baseSetCamera();
  }
}
