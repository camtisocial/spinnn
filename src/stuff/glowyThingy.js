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
      // const textMaterial = new THREE.MeshBasicMaterial({ color: color });
      const textMesh = new THREE.Mesh(geometry, textMaterial);

      // textMesh.position.set(...position);
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

      // letterGroup.userData = { index, originalY: position[1] };
      // letterGroup.userData = { index, originalX: letterGroup.position.x, originalY: letterGroup.position.y };
      letterGroup.userData = {
        index,
        originalX: letterGroup.position.x,
        originalY: letterGroup.position.y,
        textMaterial, //storing materials in a structure to mess with later
      };

      group.add(letterGroup);
    });
    group.position.set(...position);
    scene.add(group);

    // Animation
    const animate = () => {
      const elapsedTime = performance.now() / 1000;

      group.children.forEach((letterGroup) => {
        const { index, originalX, originalY, textMaterial } =
          letterGroup.userData;

        // side to side
        letterGroup.position.x =
          originalX +
          Math.sin(elapsedTime * WOBBLE_SPEED + index / 2) * WOBBLE_INTENSITY;
        // up and down
        letterGroup.position.y =
          originalY +
          Math.sin(elapsedTime * FLOAT_SPEED + index / 2) * FLOAT_INTENSITY;
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
  });
};

export default GlowyText;
