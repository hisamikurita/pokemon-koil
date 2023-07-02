import { gsap } from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { WebglBase } from "./webgl-base";
import { DURASION, isSp } from "../variables";

export class Plane extends WebglBase {
  constructor(canvas) {
    super(canvas);

    this.load = document.querySelector('[data-el="load"]');
    this.loadBar = document.querySelector('[data-el="load-bar"]');
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
        setTimeout(() => {
          this._opModels();
        }, 600);
      },
      (xhr) => {
        // オブジェクトを読み込んでいるタイミングで実行
        const percent = (xhr.loaded / xhr.total) * 100;

        gsap.to(this.loadBar, {
          duration: DURASION.FULL,
          ease: "power2.out",
          clipPath: `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`,

          onComplete: () => {
            gsap.to(this.load, {
              duration: DURASION.FULL,
              ease: "power2.out",
              opacity: 0,
            });
          },
        });
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

      model.position.x = (i / this.models.length) * window.innerWidth - window.innerWidth / 2;
      model.position.y = Math.random() * (this.positionRange.y + this.buffer * 2) - (this.positionRange.y + this.buffer * 2) / 2;
      model.position.z = Math.random() * this.positionRange.z - this.positionRange.z / 2;

      model.rotation.x = rotate.x;
      model.rotation.y = rotate.y;
      model.rotation.z = rotate.z;

      model.userData = {
        speed: isSp ? Math.random() + 0.5 : Math.random() + 1.0,
        rotate,
        scaleRange: Math.random() + 1.0,
        scale: 0,
      };

      model.scale.set(
        this.scaleBase * model.userData.scaleRange * model.userData.scale,
        this.scaleBase * model.userData.scaleRange * model.userData.scale,
        this.scaleBase * model.userData.scaleRange * model.userData.scale
      );
    }
  }

  _opModels() {
    for (let i = 0; i < this.models.length; i++) {
      const model = this.models[i];

      gsap.to(model.userData, {
        duration: DURASION.FULL,
        delay: i * 0.1,
        ease: "power2.out",
        scale: 1,
        onUpdate: () => {
          model.scale.set(this.scaleBase * model.userData.scaleRange * model.userData.scale, this.scaleBase * model.userData.scaleRange, this.scaleBase * model.userData.scaleRange);
        },
      });
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
      model.position.x = (i / this.models.length) * window.innerWidth - window.innerWidth / 2;
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
