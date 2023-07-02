import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { WebglBase } from "./webgl-base";
import { isSp } from "../variables";

export class Plane extends WebglBase {
  constructor(canvas) {
    super(canvas);

    this.rotateBase = 0.0012;
    this.scaleBase = isSp ? 20 : 40;
    this.buffer = 500;
    this.positionRange = {
      x: window.innerWidth,
      y: window.innerHeight,
      z: 1000,
    };
    this.modelsNum = 30;
    this.models = [];
  }

  async init() {
    await this._loadModel();
  }

  _loadModel() {
    const loader = new GLTFLoader();
    const url = "./koil.gltf";

    loader.load(
      url,
      (gltf) => {
        // オブジェクトの読み込みが完了したタイミングで実行
        this._generateModels(gltf);
        this._setupModels();
      },
      (xhr) => {
        // オブジェクトを読み込んでいるタイミングで実行
        console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
      },
      (error) => {
        // オブジェクトの読み込みが失敗したタイミングで実行
        console.log(error);
      }
    );
  }

  _generateModels(gltf) {
    for (let i = 0; i < this.modelsNum; i++) {
      const clone = gltf.scene.clone();
      this.models.push(clone);
      this.scene.add(clone);
    }
  }

  _setupModels() {
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i];

      const rotate = {
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
        z: Math.random() * Math.PI * 2,
      };

      const scaleRange = Math.random() + 1.0;

      this.models[i].scale.set(this.scaleBase * scaleRange, this.scaleBase * scaleRange, this.scaleBase * scaleRange);

      this.models[i].position.x = (i / this.models.length) * window.innerWidth - window.innerWidth / 2;
      this.models[i].position.y = Math.random() * (this.positionRange.y + this.buffer * 2) - (this.positionRange.y + this.buffer * 2) / 2;
      this.models[i].position.z = Math.random() * this.positionRange.z - this.positionRange.z / 2;

      this.models[i].rotation.x = rotate.x;
      this.models[i].rotation.y = rotate.y;
      this.models[i].rotation.z = rotate.z;

      model.userData = {
        speed: isSp ? Math.random() + 0.5 : Math.random() + 1.0,
        rotate,
      };
    }
  }

  onResize() {
    super.onResize();
  }

  onRaf() {
    // base
    if (this.orbitcontrols) this.orbitcontrols.update();
    this.renderer.render(this.scene, this.camera);

    // mesh
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i];
      model.position.y += model.userData.speed;
      model.rotation.x += model.userData.rotate.x * this.rotateBase;
      model.rotation.y += model.userData.rotate.y * this.rotateBase;
      model.rotation.z += model.userData.rotate.z * this.rotateBase;

      if (model.position.y > this.positionRange.y / 2 + this.buffer) {
        model.position.y = -this.positionRange.y / 2 - this.buffer;
      }
    }
  }
}
