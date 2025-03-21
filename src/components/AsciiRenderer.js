import React, { useEffect } from 'react';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect';
import * as THREE from 'three';

const AsciiRenderer = ({ renderer, scene, camera }) => {
  useEffect(() => {
    const effect = new AsciiEffect(renderer, ' .:-=+*#%@', { invert: true });
    effect.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(effect.domElement);

    renderer.setPixelRatio(window.devicePixelRatio);

    return () => {
      document.body.removeChild(effect.domElement);
    };
  }, [renderer, scene, camera]);

  return null;
};

export default AsciiRenderer;

