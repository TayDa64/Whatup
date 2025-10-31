import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Lighting from './Lighting';
import TestCube from './TestCube';

export default function GameScene() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [5, 2, 5], fov: 50 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <color attach="background" args={["#1a1a2e"]} />
        <Lighting />

        <Suspense fallback={null}>
          <TestCube />
        </Suspense>

        <OrbitControls
          enablePan={false}
          maxDistance={15}
          minDistance={2}
          maxPolarAngle={Math.PI / 2}
        />
        <Stats />
        <gridHelper args={[20, 20]} />
      </Canvas>
    </>
  );
}
