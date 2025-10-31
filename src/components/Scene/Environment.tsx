import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import { useGLTF } from '../../hooks/useGLTF';
import { ASSETS } from '../../systems/assets/AssetLoader';

type GroupType = THREE.Group;

interface EnvironmentProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

export default function Environment({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: EnvironmentProps) {
  const assetDefinition = ASSETS.find((asset) => asset.id === 'environment');
  const gltf = assetDefinition ? useGLTF(assetDefinition) : null;
  const groupRef = useRef<GroupType>(null);

  useEffect(() => {
    if (!gltf || !groupRef.current) {
      return;
    }

    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  if (!gltf) {
    return null;
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale as any}>
      <primitive object={gltf.scene.clone()} />
    </group>
  );
}
