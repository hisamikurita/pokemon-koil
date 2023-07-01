import { CircleGeometry, PlaneGeometry, InstancedBufferGeometry, InstancedBufferAttribute, RawShaderMaterial, Mesh, DoubleSide, Color } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { WebglBase } from "./webgl-base";
import GUI from "lil-gui";

export class Plane extends WebglBase {
  constructor(canvas) {
    super(canvas);

    this.speed = 1.0;
    this.scaleBase = 40;
    this.buffer = 300;
    this.positionRange = {
      x: window.innerWidth,
      y: window.innerHeight,
      z: 1000,
    };
    this.modelsNum = 20;
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

      this.models[i].position.x = Math.random() * this.positionRange.x - this.positionRange.x / 2;
      this.models[i].position.y = Math.random() * this.positionRange.y - this.positionRange.y / 2;
      this.models[i].position.z = Math.random() * this.positionRange.z - this.positionRange.z / 2;

      this.models[i].rotation.x = Math.random() * Math.PI * 2;
      this.models[i].rotation.y = Math.random() * Math.PI * 2;
      this.models[i].rotation.z = Math.random() * Math.PI * 2;

      model.userData = {
        speed: Math.random() + 1.0,
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
      model.rotation.x += model.userData.rotate.x * 0.001;
      model.rotation.y += model.userData.rotate.y * 0.001;
      model.rotation.z += model.userData.rotate.z * 0.001;

      if (model.position.y > this.positionRange.y / 2 + this.buffer) {
        model.position.y = -this.positionRange.y / 2 - this.buffer;
      }
    }
  }
}
