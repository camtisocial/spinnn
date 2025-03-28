import React, { useEffect, useRef } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import GlowyText, { triggerDriftAnimation } from "../stuff/glowyThingy.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// function to get 2d dimensions of three js object
// eslint-disable-next-line no-unused-vars
const Get2dCoords = (obj, camera, renderer) => {
  const vector = new THREE.Vector3();
  const widthHalf = 0.5 * renderer.context.canvas.width;
  const heightHalf = 0.5 * renderer.context.canvas.height;

  // obj.updateMatrixWorld();
  vector.setFromMatrixPosition(obj.matrixWorld);
  vector.project(camera);

  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;

  return { x: vector.x, y: vector.y };
};

const SceneCanvas = ({ setTriggerAnimation }) => {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const mixers = useRef([]);
  const renderer = new THREE.WebGLRenderer();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const light = new THREE.DirectionalLight(0xffffff, 5);

  let glowMaterial = null;

  useEffect(() => {
    // Configure the renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);
    renderer.domElement.style.position = "fixed";

    // Append renderer to the DOM
    if (mountRef.current) {
      mountRef.current.innerHTML = "";
      mountRef.current.style.position = "relative";
      mountRef.current.style.width = "100vw";
      mountRef.current.style.height = "100vh";
      mountRef.current.appendChild(renderer.domElement);
    }

    // Add light to the scene
    light.position.set(0, 0, 10);
    scene.add(light);

    // Position the camera
    camera.position.set(0, -1, 8);

    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;  // Smooth camera movement
    // controls.dampingFactor = 0.1;   // How much to dampen (0 - 1)
    // controls.enablePan = false;     // Disable panning
    // controls.maxDistance = 50;      // Maximum zoom out distance
    // controls.minDistance = 1;       // Minimum zoom in distance

    // Load the model
    const loader = new GLTFLoader();
    if (modelRef.current) {
      scene.remove(modelRef.current);
    }
    loader.load(
      "spin4.glb",
      // "./spin2.glb",
      (gltf) => {
        console.log("Model loaded:", gltf);
        const model = gltf.scene;
        model.name = "model";

        // Apply Wireframe Material to All Meshes
        model.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
              // color: 0xd3b3f8,
              color: 0xf3ddf1,
              wireframe: true,
            });
          }
        });

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // scene.add(model);
        if (!scene.getObjectByName("model")) {
          scene.add(model);
        }

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const [firstClip, secondClip, thirdClip, fourthClip] = gltf.animations;

          const tmpClipFirst = THREE.AnimationUtils.makeClipAdditive(firstClip);
          const firstAnimation = mixer.clipAction(tmpClipFirst);

          const tmpClipSecond =
            THREE.AnimationUtils.makeClipAdditive(secondClip);
          const secondAnimation = mixer.clipAction(tmpClipSecond);

          const tmpClipThird = THREE.AnimationUtils.makeClipAdditive(thirdClip);
          const thirdAnimation = mixer.clipAction(tmpClipThird);

          const tmpClipFourth = THREE.AnimationUtils.makeClipAdditive(fourthClip);
          const fourthAnimation = mixer.clipAction(tmpClipFourth);

          firstAnimation.setLoop(THREE.LoopRepeat, 1);
          thirdAnimation.setLoop(THREE.LoopOnce, 1);
          secondAnimation.setLoop(THREE.LoopRepeat, Infinity);
          fourthAnimation.setLoop(THREE.LoopOnce, Infinity);

          secondAnimation.play(); // ico idle
          fourthAnimation.play(); // pyramid idle
          firstAnimation.enabled = false; // ico spin
          thirdAnimation.enabled = false; // pyramid spin


          mixers.current.push(mixer);

          const triggerThirdAnimation = () => {
            if (!thirdAnimation.enabled) {
              //pyramid
              triggerDriftAnimation();
              thirdAnimation.enabled = true;
              thirdAnimation.reset();
              thirdAnimation.clampWhenFinished = true;
              thirdAnimation.play();

              //ico
              firstAnimation.enabled = true;
              firstAnimation.reset();
              firstAnimation.clampWhenFinished = true;
              firstAnimation.play();

              console.log(thirdAnimation.getClip());
            }
          };

          // Trigger the third animation after 10 seconds
          // setTimeout(triggerThirdAnimation, 1500);
          if (setTriggerAnimation) {
            setTriggerAnimation(() => triggerThirdAnimation);
          }
        }
      },
      undefined,
      (error) =>
        console.error("An error occurred while loading the model:", error),
    );

    GlowyText(scene, "Enter", [-2.8, -5.2, 0], 0x6f0099);

    // animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      const delta = clock.getDelta();
      mixers.current.forEach((mixer) => mixer.update(delta));

      // animate the glow
      if (glowMaterial) {
        const elapsedTime = clock.getElapsedTime();
        glowMaterial.uniforms.opacity.value =
          0.5 + 0.5 * Math.sin(elapsedTime * 2.0);
        glowMaterial.uniforms.glowSharpness.value =
          0.5 + 0.2 * Math.sin(elapsedTime * 3.0);
      }

      const model = scene.getObjectByName("model");
      // if (model) {
      //   model.rotation.y += delta * Math.PI * 0.1;
      // }

      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // Handle window resizing
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // add listener for scroll
    // MAKE THIS RELATIVE TO SCREEN SIZE
    const handleScroll = (event) => {
      const scrollSpeed = 0.01; // Adjust this value to control the speed of the rotation
      const scrollY = window.scrollY;
      camera.position.y = (-scrollY * scrollSpeed)-1;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // cleanup function
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
    };
    // }, [setTriggerAnimation]);
  }, []);

  return <div ref={mountRef} />;
};

export default SceneCanvas;
// create an ASCII effect by passing in the renderer and a string of characters
// const effect = new AsciiEffect(renderer, ' .:-=+#&%', { invert: true });
// effect.setSize(window.innerWidth, window.innerHeight);
// effect.domElement.style.position = 'absolute';
// effect.domElement.style.top = '0';
// effect.domElement.style.left = '0';
// effect.domElement.style.width = '100%';
// effect.domElement.style.height = '100%';
