import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { RootState } from '@react-three/fiber';
import type * as THREE from 'three';

type MeshType = THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial>;

export default function TestCube() {
  const meshRef = useRef<MeshType>(null);

  useFrame((_: RootState, delta: number) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ff6b35" />
    </mesh>
  );
}
