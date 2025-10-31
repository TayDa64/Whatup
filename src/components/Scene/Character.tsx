import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import { useGLTF } from '../../hooks/useGLTF';
import { ASSETS } from '../../systems/assets/AssetLoader';
import { useAnimations } from '@react-three/drei';

type GroupType = THREE.Group;

interface CharacterProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Character({ position = [0, 0, 0], scale = 1 }: CharacterProps) {
  const assetDefinition = ASSETS.find((asset) => asset.id === 'character');
  const gltf = assetDefinition ? useGLTF(assetDefinition) : null;
  const groupRef = useRef<GroupType>(null);
  const animations = gltf?.animations ?? [];
  const { actions } = useAnimations(animations, groupRef);

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

  // Play first available animation (Fox has several clips like Walk/Run/Survey)
  useEffect(() => {
    if (!actions) return;
    const names = Object.keys(actions);
    const first = names[0];
    const action = first ? actions[first] : undefined;
    if (action) {
      action.reset().fadeIn(0.3).play();
      return () => {
        action.fadeOut(0.3);
        action.stop();
      };
    }
    return undefined;
  }, [actions]);

  if (!gltf) {
    return null;
  }

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={gltf.scene.clone()} />
    </group>
  );
}
