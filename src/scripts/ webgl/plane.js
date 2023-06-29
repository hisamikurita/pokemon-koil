import {
  CircleGeometry,
  PlaneGeometry,
  InstancedBufferGeometry,
  InstancedBufferAttribute,
  RawShaderMaterial,
  Mesh,
  DoubleSide,
  Color,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { WebglBase } from "./webgl-base";
import GUI from "lil-gui";

export class Plane extends WebglBase {
  constructor(canvas) {
    super(canvas);

    this.scale = 50;
    this.range = {
      x: window.innerWidth,
      y: window.innerHeight,
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
        for (let i = 0; i < this.modelsNum; i++) {
          const clone = gltf.scene.clone();
          this.models.push(clone);
        }

        for (let i = 0; i < this.models.length; i++) {
          this.scene.add(this.models[i]);

          this.models[i].scale.set(this.scale, this.scale, this.scale);

          this.models[i].position.x =
            Math.random() * this.range.x - this.range.x / 2;
          this.models[i].position.y =
            Math.random() * this.range.y - this.range.y / 2;
        }
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

  onResize() {
    super.onResize();
  }

  onRaf() {
    if (this.orbitcontrols) this.orbitcontrols.update();
    this.renderer.render(this.scene, this.camera);
  }
}
