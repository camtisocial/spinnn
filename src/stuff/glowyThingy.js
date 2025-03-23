import { Text } from 'troika-three-text';
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import FakeGlowMaterial from './andersonsGlow';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


//this started as a react component but changed to a vanilla three js function to match the other scene I already made

const GlowyText = (scene, text, position = [0, 0, 0], color = 0xffffff) => {

  const loader = new FontLoader();
  loader.load('/Sriracha_Display_Regular.json', (font) => {
    const geometry = new TextGeometry(text, {
       font: font,
       size: 1.9,
       height: 2,
       depth: 0.005,
       curveSegments: 10,
       bevelEnabled: true,
       bevelThickness: 0.10,
       bevelSize: 0.01,
       bevelSegments: 3
    });

      // Basic text material
      const textMaterial = new THREE.MeshBasicMaterial({ color: color });
      const textMesh = new THREE.Mesh(geometry, textMaterial);
      textMesh.position.set(...position);

      // shell to apply shader
      const shell = textMesh.clone();
      shell.scale.multiplyScalar(1.02);

      const etherealMaterial = new FakeGlowMaterial({
          falloff: 0.1,
          glowInternalRadius: 5.0,
          glowColor: new THREE.Color('#00d5ff'),
          glowSharpness: 0.5,
          opacity: 0.2,
          side: THREE.DoubleSide,
          depthTest: false
      });

      shell.material = etherealMaterial;
      // scene.add(shell);
      const group = new THREE.Group();
      group.add(shell);
      group.add(textMesh);
      scene.add(group);
    });
};

export default GlowyText;



  //const textMesh = new Text();
  //textMesh.text = text;

  //// font options
  //textMesh.font = '/SrirachaDisplay-Regular.otf'; 
  //textMesh.fontSize = 2;
  //textMesh.letterSpacing = .1;
  //textMesh.color = color;
  //textMesh.position.set(...position);

  ////center it
  //textMesh.anchorX = 'center';
  //textMesh.anchorY = 'center';

  //textMesh.sync();

  //// invisible shell to apply shader
  //const shell = textMesh.clone();
  //shell.scale.multiplyScalar(1.05);

  //// apply shader to shell
  //const etherealMaterial = new FakeGlowMaterial({
  //  falloff: 0.1,
  //  glowInternalRadius: 6.0,
  //  glowColor: new THREE.Color('#00d5ff'),
  //  glowSharpness: 0.5,
  //  opacity: 1.0,
  //  // side: THREE.DoubleSide,
  //  // depthTest: false
  //});

  //shell.material = etherealMaterial;
  //shell.sync();


  //return { text: textMesh, glowingShell: shell, material: etherealMaterial };
//};

