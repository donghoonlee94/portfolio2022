import {
  Scene,
  PerspectiveCamera,
  AmbientLight,
  SpotLight,
  Mesh,
  Clock,
  PCFSoftShadowMap,
  PlaneGeometry,
  MeshStandardMaterial,
  WebGLRenderer,
  Color,
  TextureLoader,
  LoadingManager,
  Fog,
  SphereGeometry,
  DoubleSide,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { createCubeParticles } from './js/cubeParticles';
import lottie from 'lottie-web';

let cubeParticlesRAFID, loadingAnimation;

const body = document.body;
const loadingContainer = document.querySelector('.loading');

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

// Scene
const scene = new Scene();
scene.background = new Color('black');
// scene.fog = new Fog(0x050505, 2000, 3500);

// Camera
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 0, 100);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Light
const ambientLight = new AmbientLight('white', 0.5);
scene.add(ambientLight);

const spotLight = new SpotLight('white', 0.7);
spotLight.position.set(0, 150, 100);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 200;
scene.add(spotLight);

const gltfLoader = new GLTFLoader();

// LoadingManager
const loadingManager = new LoadingManager();
const imageLoader = new TextureLoader(loadingManager);

// Get texture
const earthTexture = imageLoader.load('../images/earth-map.jpg');
const cloudTexture = imageLoader.load('../images/earth-cloud.jpg');

// Earth
const createEarth = () => {
  const earthGeometry = new SphereGeometry(100, 32, 32);
  const cloudGeometry = new SphereGeometry(102, 32, 32);

  const eartHMaterial = new MeshStandardMaterial({
    map: earthTexture,
    side: DoubleSide,
    // alphaMap: earthTexture,
  });

  const cloudMaterial = new MeshStandardMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.5,
    side: DoubleSide,
  });

  const earthMesh = new Mesh(earthGeometry, eartHMaterial);
  const cloudMesh = new Mesh(cloudGeometry, cloudMaterial);

  earthMesh.rotation.x = 0.3;
  earthMesh.position.set(0, 0, 2000);
  cloudMesh.position.set(0, 0, 2000);

  scene.add(earthMesh);
  scene.add(cloudMesh);
};

// Cube
const { cudeParticles } = createCubeParticles();
scene.add(cudeParticles);

for (let i = 0; i < cudeParticles.geometry.attributes.position.array.length; i += 3) {
  cudeParticles.geometry.attributes.position.array[i] = cudeParticles.geometry.attributes.position.array[i] * 5;
  cudeParticles.geometry.attributes.position.array[i + 1] = cudeParticles.geometry.attributes.position.array[i + 1] * 5;
  cudeParticles.geometry.attributes.position.array[i + 2] = cudeParticles.geometry.attributes.position.array[i + 2] * 5;
}

// 그리기
const clock = new Clock();

const animateCubeParticles = () => {
  const time = Date.now() * 0.001;
  cudeParticles.rotation.x = time * 0.25;
  cudeParticles.rotation.y = time * 0.5;

  cubeParticlesRAFID = requestAnimationFrame(animateCubeParticles);
};

const spreadCubeParticles = () => {};

spreadCubeParticles();

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

function throttle(callback, delayTime) {
  let timerId;

  return () => {
    if (timerId) return;

    timerId = setTimeout(() => {
      callback();
      timerId = null;
    }, delayTime);
  };
}

let scrollTop,
  docHeight,
  winHeight,
  scrollPercent,
  scrollPercentRounded,
  text,
  currentSection = 0;
function animateScrollPercent() {
  scrollTop = window.scrollY;
  docHeight = document.body.offsetHeight;
  winHeight = window.innerHeight;
  scrollPercent = scrollTop / (docHeight - winHeight);
  scrollPercentRounded = Math.round(scrollPercent * 100);
  text = `(${scrollPercentRounded}%)`;
  console.log(text);
}

function setSection() {
  currentSection = Math.round(scrollTop / winHeight) || 0;

  // gsap.to(camera.position, {
  //   duration: 1,
  //   x: houses[currentSection].x,
  //   z: houses[currentSection].z + 5,
  // });
}

const initCameraAnimation = () => {
  gsap.to(camera.position, {
    duration: 5,
    z: 3000,
  });
};

const removeLoadingContainer = () => {
  loadingContainer.remove();
};

const loading = () => {
  loadingAnimation = lottie.loadAnimation({
    container: loadingContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './js/loading-lottie.js',
  });
};

const loadingComplete = () => {
  gsap.to('.loading', {
    duration: 3,
    opacity: 0,
    onStart: () => {
      animateCubeParticles();

      setTimeout(initCameraAnimation, 500);
    },
    onComplete: () => {
      setTimeout(removeLoadingContainer, 2000);
    },
  });
};

const animate = () => {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  renderer.setAnimationLoop(animate);
};

// 이벤트
// window.addEventListener('scroll', throttle(setSection, 100));
window.addEventListener('resize', setSize);
window.addEventListener('scroll', throttle(animateScrollPercent, 100));

// On loaded texture
loadingManager.onLoad = async () => {
  await createEarth();
  animate();

  setTimeout(loadingComplete, 500);
};

loading();
