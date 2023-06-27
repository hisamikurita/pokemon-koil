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
  }

  async init() {
    await this._loadModel();
  }

  _loadModel() {
    const loader = new GLTFLoader();
    const url = "/koil.gltf";

    loader.load(
      url,
      (gltf) => {
        // オブジェクトの読み込みが完了したタイミングで実行
        this.scene.add(gltf.scene);

        console.log(gltf);
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
