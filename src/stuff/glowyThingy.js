import { Text } from "troika-three-text";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import FakeGlowMaterial from "./andersonsGlow";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// Wobble Animation Settings
const WOBBLE_SPEED = 0.8;
const FLOAT_SPEED = 0.4;
const WOBBLE_INTENSITY = 0.02;
const FLOAT_INTENSITY = 0.02;
const PULSE_SPEED = 0.8;
const PULSE_INTENSITY = 0.5;
let storedGroup = null;

//this started as a react component but changed to a vanilla three js function to match the other scene I already made
const GlowyText = (scene, text, position = [0, 0, 0], color = 0x31d43b) => {
  const loader = new FontLoader();
  loader.load("Sriracha_Display_Regular.json", (font) => {
    // loader.load("/Sriracha_Display_Regular.json", (font) => {
    const group = new THREE.Group();
    let offsetX = 0;

    text.split("").forEach((letter, index) => {
      if (letter === " ") {
        offsetX += 0.2;
        return;
      }

      const geometry = new TextGeometry(letter, {
        font: font,
        size: 1.9,
        height: 2,
        depth: 0.005,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.01,
        bevelSegments: 3,
      });

      const textMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
      });

      textMaterial.polygonOffset = true;
      textMaterial.polygonOffsetFactor = 1;
      textMaterial.polygonOffsetUnits = 1;
      const textMesh = new THREE.Mesh(geometry, textMaterial);

      textMesh.position.set(offsetX, 0, 0);

      const width = 1.5;

      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox;
      const centerX = (boundingBox.max.x + boundingBox.min.x) / 2;
      const centerY = (boundingBox.max.y + boundingBox.min.y) / 2;
      const centerZ = (boundingBox.max.z + boundingBox.min.z) / 2;
      geometry.translate(-centerX, -centerY, -centerZ);
      const letterWidth =
        geometry.boundingBox.max.x - geometry.boundingBox.min.x;
      offsetX += width;
      if (text[index + 1] === "e") {
        offsetX -= 0.35;
      }

      // shell to apply shader
      const shell = textMesh.clone();
      shell.scale.multiplyScalar(1.15);

      const etherealMaterial = new FakeGlowMaterial({
        falloff: 0.1,
        glowInternalRadius: 10.0,
        glowColor: new THREE.Color("#00d5ff"),
        glowSharpness: 3.5,
        opacity: 0.25,
        side: THREE.DoubleSide,
        depthTest: false, //unsure if I like this on or off
      });

      shell.material = etherealMaterial;

      const letterGroup = new THREE.Group();
      letterGroup.add(textMesh);
      letterGroup.add(shell);

      letterGroup.userData = {
        index,
        originalX: letterGroup.position.x,
        originalY: letterGroup.position.y,
        drifting: false,
        driftIntensity: 0.10,
        textMaterial, //storing materials in a structure to mess with later
      };
      group.add(letterGroup);
    });

    group.position.set(...position);
    scene.add(group);
    storedGroup = group; // Store the group for external access

    // Animation
    const animate = () => {
      const elapsedTime = performance.now() / 1000;

      group.children.forEach((letterGroup) => {
        const {
          index,
          originalX,
          originalY,
          textMaterial,
          drifting,
          driftIntensity,
          driftDirection,
          rotationSpeed,
          rotSpeedMod = .2,
        } = letterGroup.userData;

        //drift, runs when clicked
        if (drifting && driftDirection) {

          letterGroup.position.x += (driftDirection.x * driftIntensity+index/200)-.009;
          letterGroup.position.y += driftDirection.y * driftIntensity;
          letterGroup.position.z += driftDirection.z * driftIntensity;

          letterGroup.children.forEach((child) => {
            child.rotation.x += rotationSpeed.x*rotSpeedMod;
            child.rotation.y += rotationSpeed.y*rotSpeedMod;
            child.rotation.z += rotationSpeed.z*rotSpeedMod;
          });

          letterGroup.rotation.x += rotationSpeed.x;
          letterGroup.rotation.y += rotationSpeed.y;
          letterGroup.rotation.z += rotationSpeed.z;

        } else {
          letterGroup.position.x =
            originalX +
            Math.sin(elapsedTime * WOBBLE_SPEED + index / 2) * WOBBLE_INTENSITY;
          // up and down
          letterGroup.position.y =
            originalY +
            Math.sin(elapsedTime * FLOAT_SPEED + index / 2) * FLOAT_INTENSITY;
        }

        // side to side
        // rotate
        letterGroup.rotation.x =
          Math.sin(elapsedTime * WOBBLE_SPEED * 0.8 + index) * 0.1;
        letterGroup.rotation.z =
          Math.sin(elapsedTime * WOBBLE_SPEED * 0.8 + index) * 0.03;
        letterGroup.rotation.y =
          Math.sin(elapsedTime * WOBBLE_SPEED * 1.2 + index) * 0.04;

        //glow/opacity
        const pulse =
          0.5 + Math.sin(elapsedTime * PULSE_SPEED + index) * PULSE_INTENSITY;
        if (textMaterial) {
          textMaterial.opacity = pulse;
        }
      });

      requestAnimationFrame(animate);
    };
    animate();
    return group;
  });
};

export const triggerDriftAnimation = () => {
  setTimeout(() => {
    if (storedGroup) {
      console.log("Triggering drift animation", storedGroup);
      storedGroup.children.forEach((letterGroup) => {
        letterGroup.userData.drifting = true;

        // Generate a random drift direction and speed for each letter
        letterGroup.userData.driftDirection = new THREE.Vector3(
          .0,
          -.1*window.innerHeight/800,
          (Math.random() - 0.5) * 0.1, 
        );

        letterGroup.userData.rotationSpeed = new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
        );
      });
    }
  }, 1000);
};

export default GlowyText;
