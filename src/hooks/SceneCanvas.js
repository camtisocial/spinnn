import React, { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

const SceneCanvas = () => {

  // create a ref to the scene, this will be used to append the renderer to the DOM react style
  const mountRef = useRef(null);
  //create a ref to mixers
  const mixers = useRef([]);


  useEffect(() => {
  // create scene and camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


  // create/configure renderer then append to DOM
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  // append renderer to DOM
  if (mountRef.current) {
    mountRef.current.appendChild(renderer.domElement);
  }

  // create a light
  const light = new THREE.DirectionalLight(0xffffff, 5);
  light.position.set(0, 0, 10);
  scene.add(light);

  // position camera
  camera.position.z = 5;
  camera.position.y = 1;
  
  // create a loader for pulling in a .glb or .gltf file made in Blender
  const loader = new GLTFLoader();
  loader.load(
    '/spin.glb',
    function(gltf) {
      const model = gltf.scene;
      scene.add(model);
      if (gltf.animations && gltf.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(clip => {
          const action = mixer.clipAction(clip);
          action.play();
          });
          mixers.current.push(mixer);
        }
    }, undefined, function(error) {
         console.error(error);
   });

  // animation loop
  const clock = new THREE.Clock();
    function animate() {
      const delta = clock.getDelta();
      mixers.current.forEach(mixer => mixer.update(delta));
      renderer.render(scene, camera);
    }
  renderer.setAnimationLoop(animate);


  // handle window resizing
  const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

  // clean up function
  return () => {
    if (mountRef.current) {
      mountRef.current.removeChild(renderer.domElement);
    }
    renderer.dispose();
  };

}, []);
  
  return <div ref={mountRef} />;
};

export default SceneCanvas;

