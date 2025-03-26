import React, { useEffect, useRef } from "react";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import GlowyText from "../stuff/glowyThingy.js";
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

const SceneCanvas = ({ setTriggerAnimation}) => {
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
      "spin3.glb",
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
          const [firstAnimation, secondAnimation, thirdAnimation] =
            gltf.animations.map((clip) => mixer.clipAction(clip));
          firstAnimation.setLoop(THREE.LoopRepeat, Infinity);
          secondAnimation.setLoop(THREE.LoopRepeat, Infinity);
          thirdAnimation.setLoop(THREE.LoopOnce, 0);

          firstAnimation.play();
          secondAnimation.play();
          thirdAnimation.enabled = false;

          mixers.current.push(mixer);

          const triggerThirdAnimation = () => {
          console.log("Third Animation State: ", thirdAnimation.isRunning());

            if (!thirdAnimation.enabled) {
              thirdAnimation.enabled = true;
              thirdAnimation.reset();
              thirdAnimation.play();
             console.log("After triggering: ", thirdAnimation.isRunning());

            }
          };
          if (setTriggerAnimation) {
            setTriggerAnimation(() => triggerThirdAnimation);
          }

          // Trigger the third animation after 10 seconds
          // setTimeout(triggerThirdAnimation, 1000);
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

      // animate the pyramid thingy
      // const model = scene.getObjectByName("model");
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

    // cleanup function
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      window.removeEventListener("resize", handleResize);
    };
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
