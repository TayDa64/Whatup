import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Lighting from './Lighting';
import Character from './Character';
import Environment from './Environment';
import LoadingScreen from './LoadingScreen';

export default function GameScene() {
  return (
    <>
      <LoadingScreen />
      <Canvas
        shadows
        camera={{ position: [5, 2, 5], fov: 50 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <color attach="background" args={["#1a1a2e"]} />
        <Lighting />

        <Suspense fallback={null}>
          <Environment position={[0, 0, 0]} />
          <Character position={[0, 0, 0]} scale={1} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          maxDistance={15}
          minDistance={2}
          maxPolarAngle={Math.PI / 2}
        />
        <Stats />
      </Canvas>
    </>
  );
}
