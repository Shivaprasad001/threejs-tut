import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import stars from '../assets/img/starss.webp';
import nebula from '../assets/img/nebula.avif';

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(0,2,5);
orbit.update();

const textureLoader = new THREE.TextureLoader();
//scene.background = textureLoader.load(stars);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    nebula,
    nebula,
    stars,
    stars,
    stars,
    stars
]);

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula)});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const gridHelper = new THREE.GridHelper(30, 100);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4,50,50);
const sphereMaterial = new THREE.MeshStandardMaterial({color: 0x0000FF, wireframe: false});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-10,-10,0);
scene.add(sphere);
sphere.castShadow = true;

const planeGeometry = new THREE.PlaneGeometry(50,30);
const planeMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);
plane.receiveShadow = true;

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
//ambientLight.castShadow = true;

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// directionalLight.position.set(-30,50,0);
// scene.add(directionalLight);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100,100,0);
spotLight.castShadow = true;
spotLight.angle = 0.02;


const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xFFFFFF,0,200);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

const gui = new dat.GUI();
const options = {
    sphereColor: "#ffea00",
    speed : 0.01
};

gui.addColor(options, 'sphereColor').onChange(function(e) {
    sphere.material.color.set(e)
});

gui.add(options, 'speed', 0, 0.1);

let step = 0;

function animate(time) {
    box.rotation.x = time/1000;
    box.rotation.y = time/1000;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);