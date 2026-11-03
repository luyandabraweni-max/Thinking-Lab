// 3D character: the CC0 "RobotExpressive" model by Tomás Laulhé (Quaternius), drawn with three.js.
// Loaded only when a learner picks the 3D robot (js/screens/avatar.js decides when), so other learners never download it.
import * as THREE from "../vendor/three/three.module.min.js";
import { GLTFLoader } from "../vendor/three/GLTFLoader.js";
import { clone } from "../vendor/three/SkeletonUtils.js";

const MODEL = new URL("../assets/3d/robot-expressive.glb", import.meta.url).href;
let model;
const loadModel = () => model || (model = new GLTFLoader().loadAsync(MODEL));

// Draws the robot into el (a square box) in the given body colour. It idles, leans towards the pointer
// (the --tx/--ty values the 2D avatar also uses) and cleans itself up once el leaves the page.
export async function mount(el, colour) {
  const gltf = await loadModel();
  if (!el.isConnected) return null;
  const robot = clone(gltf.scene), owned = [];
  robot.traverse(o => {
    if (!o.isMesh) return;
    o.material = o.material.clone(); owned.push(o.material);
    if (o.material.name === "Main") o.material.color.set(colour);
  });
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
  scene.add(robot);

  const mixer = new THREE.AnimationMixer(robot), act = n => mixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, n));
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
    robot.rotation.y += (tx * 0.6 - robot.rotation.y) * 0.08;
    mixer.update(Math.min(clock.getDelta(), 0.1));
    renderer.render(scene, camera);
  });
  return { wave: () => play("Wave"), nod: () => play("Yes"), dispose };
}
