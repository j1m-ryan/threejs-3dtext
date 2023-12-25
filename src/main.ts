import * as THREE from "three";
import {
  FontLoader,
  OrbitControls,
  TextGeometry,
} from "three/examples/jsm/Addons.js";
import { Timer } from "three/examples/jsm/misc/Timer.js";
import { resizeRendererToDisplaySize } from "./utils/resize";
import { createDoubleClickListener } from "./utils/fullscreen";
import gsap from "gsap";
import { cubeFolder, cameraFolder } from "./libgui";

const fontLoader = new FontLoader();

function main() {
  const canvas = document.getElementById("c") as HTMLCanvasElement | null;
  if (!canvas) {
    alert("canvas not found");
    return;
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  const textureLoader = new THREE.TextureLoader();

  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
  camera.position.z = 1;
  cameraFolder
    .add(camera.position, "z")
    .min(-3)
    .max(3)
    .step(0.1)
    .name("camera position z");

  const scene = new THREE.Scene();

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);

  const matcapTexture = textureLoader.load("../static/matcaps/ice.png");
  matcapTexture.colorSpace = THREE.SRGBColorSpace;

  // fonts
  const cascadiaCodeFont = fontLoader.load(
    "../static/fonts/Cascadia Code_Regular.json",
    (font) => {
      console.log("font loaded");
      const bevelThickness = 0.02;
      const bevelSize = 0.005;
      const textGeometry = new TextGeometry("Hello World", {
        font,
        size: 0.3,
        height: 0.04,
        depth: 1,
        curveSegments: 3,
        bevelEnabled: true,
        bevelThickness,
        bevelSize,
        // bevelOffset: 0.2,
        bevelSegments: 7,
      });
      textGeometry.center();
      const textMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
      });
      const text = new THREE.Mesh(textGeometry, textMaterial);

      // text.position.x = -1;
      scene.add(text);
    }
  );

  const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const donutGeometry = new THREE.TorusGeometry(0.2, 0.1);

  for (let i = 0; i < 300; i++) {
    const mesh = new THREE.Mesh(donutGeometry, donutMaterial);
    mesh.position.x = (Math.random() - 0.5) * 5;
    mesh.position.y = (Math.random() - 0.5) * 5;
    mesh.position.z = (Math.random() - 0.5) * 5;
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    const newScale = Math.random();
    mesh.scale.set(newScale, newScale, newScale);

    scene.add(mesh);
  }

  const timer = new Timer();

  const tick = () => {
    const elapsedTime = timer.getElapsed();
    timer.update();

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    renderer.render(scene, camera);
    controls.update();

    requestAnimationFrame(tick);
  };

  createDoubleClickListener(canvas);

  tick();
}

main();
