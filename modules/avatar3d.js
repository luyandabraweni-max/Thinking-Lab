// 3D characters, drawn with three.js. Both models are CC0 by Quaternius (see assets/3d/LICENSE.txt).
// Loaded only when a learner picks a 3D character (js/screens/avatar.js decides when), so other learners never download it.
import * as THREE from "../vendor/three/three.module.min.js";
import { GLTFLoader } from "../vendor/three/GLTFLoader.js";
import { clone } from "../vendor/three/SkeletonUtils.js";

// Each model: its file, and which of its materials take the learner's colours (keys match avatarStage's data-colours).
const MODELS = {
  robot: { file: "robot-expressive.glb", paint: { Main: "top" } },
  person: { file: "person-casual.glb", paint: { Skin: "skin", Hair: "hair", Eyebrows: "hair", Purple: "top" } }
};
const loaded = {};
const loadModel = kind => loaded[kind] || (loaded[kind] = new GLTFLoader().loadAsync(new URL(`../assets/3d/${MODELS[kind].file}`, import.meta.url).href));

// Draws the character into el (a square box) in the learner's colours. It idles, turns towards the pointer
// (the --tx value the 2D avatar also uses) and cleans itself up once el leaves the page.
export async function mount(el, kind, colours) {
  const spec = MODELS[kind]; if (!spec) return null;
  const gltf = await loadModel(kind);
  if (!el.isConnected) return null;
  const figure = clone(gltf.scene), owned = [];
  figure.traverse(o => {
    if (!o.isMesh) return;
    o.material = o.material.clone(); owned.push(o.material);
    const key = spec.paint[o.material.name]; if (key && colours[key]) o.material.color.set(colours[key]);
  });
  // Same size and place whatever the model's own units: 4 units tall, feet on the ground, centred.
  const box = new THREE.Box3().setFromObject(figure), h = box.max.y - box.min.y || 1, k = 4 / h;
  figure.scale.setScalar(k);
  figure.position.set(-(box.min.x + box.max.x) / 2 * k, -box.min.y * k, -(box.min.z + box.max.z) / 2 * k);

  const size = el.clientWidth || 160;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(size, size);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 2.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(3, 6, 5); scene.add(sun);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 2.6, 9.2); camera.lookAt(0, 2.3, 0);
  scene.add(figure);

  const mixer = new THREE.AnimationMixer(figure), act = n => mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, n));
  const idle = act("Idle"); idle.play();
  let current = idle;
  const play = name => {
    const a = act(name);
    if (current === a) { a.reset(); return; } // tapped again mid-wave: start the wave over
    a.reset(); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true;
    current.crossFadeTo(a, 0.25, false); a.play(); current = a;
    const done = e => { if (e.action !== a) return; mixer.removeEventListener("finished", done); if (current === a) { idle.reset().play(); a.crossFadeTo(idle, 0.35, false); current = idle; } };
    mixer.addEventListener("finished", done);
  };

  el.appendChild(renderer.domElement);
  const clock = new THREE.Clock();
  const dispose = () => { renderer.setAnimationLoop(null); owned.forEach(m => m.dispose()); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); };
  renderer.setAnimationLoop(() => {
    if (!el.isConnected) return dispose();
    const tx = parseFloat(getComputedStyle(el).getPropertyValue("--tx")) || 0; // inherited from the avatar stage's scope
    figure.rotation.y += (tx * 0.6 - figure.rotation.y) * 0.08;
    mixer.update(Math.min(clock.getDelta(), 0.1));
    renderer.render(scene, camera);
  });
  return { wave: () => play("Wave"), dispose };
}
