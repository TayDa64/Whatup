import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function RendererTuning() {
  const { gl } = useThree();

  useEffect(() => {
    // Ensure sRGB output for consistent color management
    // three r155+ defaults to correct color space, but being explicit here
    (gl as any).outputColorSpace = THREE.SRGBColorSpace;
    // Softer shadow filtering
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
  }, [gl]);

  return null;
}
