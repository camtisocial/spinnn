import React, { useEffect, useRef } from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect';
import * as THREE from 'three';

const SceneCanvas = () => {

  // create a ref to hold the mount point for the renderer
  const mountRef = useRef(null);
  const mixers = useRef([]);

  // create a renderer, scene, and camera
  const renderer = new THREE.WebGLRenderer();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const light = new THREE.DirectionalLight(0xffffff, 5);

  useEffect(() => {
  // configure renderer then append to DOM
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  // create an ASCII effect by passing in the renderer and a string of characters
  const effect = new AsciiEffect(renderer, ' .:-=+*#%@', { invert: true });
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.position = 'absolute';
  effect.domElement.style.top = '0';
  effect.domElement.style.left = '0';
  effect.domElement.style.width = '100%';
  effect.domElement.style.height = '100%';

  // append renderer to DOM
  if (mountRef.current) {
      mountRef.current.innerHTML = '';
      mountRef.current.style.position = 'relative';
      mountRef.current.style.width = '100vw';
      mountRef.current.style.height = '100vh';
      mountRef.current.appendChild(effect.domElement);
  }

  // create a light
  light.position.set(0, 0, 10);
  scene.add(light);

  // position camera
  camera.position.z = 5;
  camera.position.y = 1;
  camera.position.x = 0.5;
  
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
      effect.render(scene, camera);
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
    window.removeEventListener('resize', handleResize);
  };

}, []);
  
  return <div ref={mountRef} />;
};

export default SceneCanvas;

