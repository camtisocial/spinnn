import { Text } from 'troika-three-text';
import * as THREE from 'three';
import FakeGlowMaterial from './andersonsGlow';

//this started as a react component but changed to a vanilla three js function to match the other scene I already made

const GlowyText = (text, position = [0, 0, 0], color = 0xffffff) => {
  const textMesh = new Text();
  textMesh.text = text;

  // font options
  textMesh.font = '/SrirachaDisplay-Regular.otf'; 
  textMesh.fontSize = 2;
  textMesh.letterSpacing = .1;
  textMesh.color = color;
  textMesh.position.set(...position);

  //center it
  textMesh.anchorX = 'center';
  textMesh.anchorY = 'center';

  textMesh.sync();

  // invisible shell to apply shader
  const shell = textMesh.clone();
  shell.scale.multiplyScalar(1.05);

  // apply shader to shell
  const etherealMaterial = new FakeGlowMaterial({
    falloff: 0.1,
    glowInternalRadius: 6.0,
    glowColor: new THREE.Color('#00d5ff'),
    glowSharpness: 0.5,
    opacity: 1.0,
    // side: THREE.DoubleSide,
    // depthTest: false
  });

  shell.material = etherealMaterial;
  shell.sync();


  return { text: textMesh, glowingShell: shell, material: etherealMaterial };
};

export default GlowyText;
