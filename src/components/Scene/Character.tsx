import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import { useGLTF } from '../../hooks/useGLTF';
import { ASSETS } from '../../systems/assets/AssetLoader';

type GroupType = THREE.Group;

interface CharacterProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Character({ position = [0, 0, 0], scale = 1 }: CharacterProps) {
  const assetDefinition = ASSETS.find((asset) => asset.id === 'character');
  const gltf = assetDefinition ? useGLTF(assetDefinition) : null;
  const groupRef = useRef<GroupType>(null);

  useEffect(() => {
    if (!gltf || !groupRef.current) {
      return;
    }

    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);

  if (!gltf) {
    return null;
  }

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={gltf.scene.clone()} />
    </group>
  );
}
