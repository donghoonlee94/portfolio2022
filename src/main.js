import {
  Scene,
  PerspectiveCamera,
  AmbientLight,
  Mesh,
  PCFSoftShadowMap,
  MeshStandardMaterial,
  WebGLRenderer,
  Color,
  TextureLoader,
  SphereGeometry,
  DoubleSide,
  MeshPhongMaterial,
  FrontSide,
  BufferGeometry,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  AdditiveBlending,
  BackSide,
  PointLight,
  PointLightHelper,
} from 'three';
import { menuAnimation } from './js/menu';
import { textAnimation } from './js/text';
import gsap from 'gsap';
import lottie from 'lottie-web';
// import { Sky } from 'three/examples/jsm/objects/Sky';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import dat from 'dat.gui';

let scene, camera, canvas, renderer, ambientLight, earth, cloud, loadingCompleted, universeMesh, pointLight;

const secstions = document.querySelectorAll('.section');
const lastSection = secstions[1];
const loadingContainer = document.querySelector('.loading');
const scrollTopBtn = document.querySelector('.scroll-top-btn');
const scrollBottomBtn = document.querySelector('.scroll-bottom-btn');
const body = document.body;

let scrollTop,
  winHeight,
  currentSection = 0;

const objectPositionsZ = [0, 90];

const scrollBottomEvent = () => {
  window.scrollTo({ top: lastSection.offsetTop });
};

const scrollTopEvent = () => {
  window.scrollTo({ top: 0 });
};

const setSection = () => {
  if (!loadingCompleted) return;

  scrollTop = window.scrollY;
  winHeight = window.innerHeight;
  currentSection = Math.round(scrollTop / winHeight) || 0;

  gsap.to(camera.position, {
    duration: 3,
    z: objectPositionsZ[currentSection],
    ease: 'power2.inOut',
  });
};

const removeLoadingContainer = () => {
  loadingContainer.remove();
  loadingCompleted = true;
  body.style = 'overflow-y: scroll';
};

const loading = () => {
  lottie.loadAnimation({
    container: loadingContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './js/loading-lottie.json',
  });
};

const loadingComplete = () => {
  gsap.to('.loading', {
    duration: 2,
    opacity: 0,
    onComplete: () => {
      setTimeout(removeLoadingContainer, 2000);
      textAnimation();
    },
  });
};

const spreadCubeParticles = () => {};

spreadCubeParticles();

const setSize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
};

const throttle = (callback, delayTime) => {
  let timerId;

  return () => {
    if (timerId) return;

    timerId = setTimeout(() => {
      callback();
      timerId = null;
    }, delayTime);
  };
};

const animateCubeParticles = () => {
  const time = Date.now() * 0.001;
  cudeParticles.rotation.x = time * 0.25;
  cudeParticles.rotation.y = time * 0.5;

  cubeParticlesRAFID = requestAnimationFrame(animateCubeParticles);
};

const animate = () => {
  pointLight.position.x = 500 * Math.sin(Date.now() / 5000);
  pointLight.position.z = 500 * Math.cos(Date.now() / 5000);

  renderer.render(scene, camera);
  renderer.setAnimationLoop(animate);
};

function addSnowFlakes() {
  const positions = [],
    velocities = [];
  let snowFlakes;
  const numSnowFlakes = 15000;
  const maxRange = 1000,
    minRange = maxRange / 2;
  const minHeight = 0;

  const snowGeometry = new BufferGeometry();
  const textureLoader = new TextureLoader();

  for (let i = 0; i < numSnowFlakes; i++) {
    positions.push(
      Math.floor(Math.random() * maxRange - minRange), // x 0 to 500
      Math.floor(Math.random() * minRange + minHeight), // y 250 to 750;
      Math.floor(Math.random() * maxRange - minRange) // z 0 to 500
    );

    velocities.push(
      Math.floor(Math.random() * 6 - 3) * 0.1, // x 0.3 to 0.3
      Math.floor(Math.random() * 5 + 0.12) * 0.1, // y 0.02 to 0.92
      Math.floor(Math.random() * 6 - 3) * 0.1 // z 0.3 to 0.3
    );
  }

  snowGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  snowGeometry.setAttribute('velocity', new Float32BufferAttribute(velocities, 3));

  const flakeMaterial = new PointsMaterial({
    size: 4,
    map: textureLoader.load('./images/snowflake1.png'),
    blending: AdditiveBlending,
    depthTest: false,
    depthWrite: true,
    transparent: true,
    opacity: 0.9,
  });

  snowFlakes = new Points(snowGeometry, flakeMaterial);
  snowFlakes.position.set(0, -100, 0);

  scene.add(snowFlakes);

  const animationSnowFlakes = () => {
    for (let i = 0; i < numSnowFlakes * 3; i += 3) {
      snowFlakes.geometry.attributes.position.array[i] -= snowFlakes.geometry.attributes.velocity.array[i];
      snowFlakes.geometry.attributes.position.array[i + 1] -= snowFlakes.geometry.attributes.velocity.array[i + 1];
      snowFlakes.geometry.attributes.position.array[i + 2] -= snowFlakes.geometry.attributes.velocity.array[i + 2];

      if (snowFlakes.geometry.attributes.position.array[i + 1] < 0) {
        snowFlakes.geometry.attributes.position.array[i] = Math.floor(Math.random() * maxRange - minRange); // x
        snowFlakes.geometry.attributes.position.array[i + 1] = Math.floor(Math.random() * minRange + minHeight); // y
        snowFlakes.geometry.attributes.position.array[i + 2] = Math.floor(Math.random() * maxRange - minRange); // z
      }
    }

    snowFlakes.geometry.attributes.position.needsUpdate = true;

    requestAnimationFrame(animationSnowFlakes);
  };

  animationSnowFlakes();
}

const createUniverse = () => {
  // // 우주 만들기
  const universeMap = new TextureLoader().load('./images/starfield.png');
  const universeSphereGeometry = new SphereGeometry(100, 32, 32);
  const universeMaterial = new MeshPhongMaterial({
    transparent: true,
    map: universeMap,
    side: DoubleSide,
    opacity: 1,
  });

  universeMesh = new Mesh(universeSphereGeometry, universeMaterial);
  universeMesh.receiveShadow = false;

  universeMesh.position.set(0, 0, 0);

  scene.add(universeMesh);

  // 우주 회전
  const loopRotationUniverse = () => {
    universeMesh.rotation.x += 0.001;
    universeMesh.rotation.y += 0.00025;

    requestAnimationFrame(loopRotationUniverse);
  };

  loopRotationUniverse();

  // Add Sky
  // const sky = new Sky();
  // sky.scale.setScalar(450000);
  // scene.add(sky);

  // const sun = new Vector3();

  // const effectController = {
  //   turbidity: 10,
  //   rayleigh: 3,
  //   mieCoefficient: 0.005,
  //   mieDirectionalG: 0.7,
  //   elevation: 2,
  //   azimuth: 180,
  //   exposure: renderer.toneMappingExposure,
  // };

  // const uniforms = sky.material.uniforms;
  // uniforms['turbidity'].value = effectController.turbidity;
  // uniforms['rayleigh'].value = effectController.rayleigh;
  // uniforms['mieCoefficient'].value = effectController.mieCoefficient;
  // uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

  // const phi = MathUtils.degToRad(90 - effectController.elevation);
  // const theta = MathUtils.degToRad(effectController.azimuth);

  // sun.setFromSphericalCoords(1, phi, theta);

  // uniforms['sunPosition'].value.copy(sun);

  // renderer.toneMappingExposure = effectController.exposure;

  // 구름 만들기

  const cloudMap = new TextureLoader().load('./images/earth-cloud.jpg');
  const cloudMaterial = new MeshPhongMaterial({
    map: cloudMap,
    depthWrite: true,
    side: FrontSide,
    transparent: true,
    opacity: 0.3,
  });
  const cloudGeometry = new SphereGeometry(20.1, 32, 32);
  cloud = new Mesh(cloudGeometry, cloudMaterial);
  cloud.position.set(0, 0, 0);
  scene.add(cloud);

  // 구름 회전
  const loopRotationCloud = () => {
    cloud.rotation.y += 0.0005;

    requestAnimationFrame(loopRotationCloud);
  };

  loopRotationCloud();

  // earth
  const earthMap = new TextureLoader().load('./images/earth-map.jpg');
  const material_earth = new MeshStandardMaterial({
    map: earthMap,
    depthWrite: true,
    side: FrontSide,
  });
  const geometry_earth = new SphereGeometry(20, 32, 32);
  earth = new Mesh(geometry_earth, material_earth);
  earth.position.set(0, 0, 0);
  earth.rotation.x = 0.3;
  earth.castShadow = false;
  scene.add(earth);

  const loopRotationEarth = () => {
    earth.rotation.y += 0.0003;

    requestAnimationFrame(loopRotationEarth);
  };

  loopRotationEarth();
};

const createSnowWorld = () => {
  const snowMap = new TextureLoader().load('./images/snowfield.png');
  const materialSnowWorld = new MeshStandardMaterial({
    side: BackSide,
    map: snowMap,
  });
  const geometrySnowWorld = new SphereGeometry(19, 32, 32);
  const snowWorldMesh = new Mesh(geometrySnowWorld, materialSnowWorld);
  snowWorldMesh.position.set(0, 0, 0);
  snowWorldMesh.rotation.y = 2;
  scene.add(snowWorldMesh);

  const loopRotationSnowWorld = () => {
    snowWorldMesh.rotation.y += 0.0005;
    requestAnimationFrame(loopRotationSnowWorld);
  };

  loopRotationSnowWorld();
};

const init = () => {
  window.scrollTo({ top: 0 });
  loading();

  scene = new Scene();
  scene.background = new Color('black');

  canvas = document.querySelector('#three-canvas');
  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.set(0, 0, 10);
  scene.add(camera);

  // const controls = new OrbitControls(camera, renderer.domElement);

  pointLight = new PointLight(0xffffff, 5, 1000);
  pointLight.position.set(50, 100, 50);
  scene.add(pointLight);

  // const pointLightHelper = new PointLightHelper(pointLight, 50);
  // scene.add(pointLightHelper);

  animate();

  // const spotLight = new SpotLight(0xffffff, 10, 1000, Math.PI / 3);

  // spotLight.position.set(-500, 0, 100);

  // scene.add(spotLight);

  // const spotLightHelper = new SpotLightHelper(spotLight);
  // scene.add(spotLightHelper);

  // const directionalLight = new DirectionalLight(0xffffff, 2);
  // directionalLight.position.set(-500, 500, 0);
  // scene.add(directionalLight);

  // const directionalLightHelper = new DirectionalLightHelper(directionalLight, 10);
  // scene.add(directionalLightHelper);

  ambientLight = new AmbientLight('white', 0.5);
  scene.add(ambientLight);

  createSnowWorld();

  createUniverse();

  addSnowFlakes();

  // Dat GUI
  // const gui = new dat.GUI();
  // gui.add(pointLight.position, 'y', -100, 100, 0.01).name('y 위치');
  // gui.add(pointLight.position, 'x', -100, 100, 0.01).name('x 위치');
  // gui.add(pointLight.position, 'z', -100, 100, 0.01).name('z 위치');

  setTimeout(loadingComplete, 500);
};

init();
menuAnimation();

// 이벤트
window.addEventListener('resize', setSize);
window.addEventListener('scroll', throttle(setSection, 100));
scrollBottomBtn.addEventListener('click', scrollBottomEvent);
scrollTopBtn.addEventListener('click', scrollTopEvent);
