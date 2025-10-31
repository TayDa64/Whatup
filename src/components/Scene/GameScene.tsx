import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, ContactShadows } from '@react-three/drei';
import Lighting from './Lighting';
import Character from './Character';
import Environment from './Environment';
import LoadingScreen from './LoadingScreen';
import SimpleRoom from './SimpleRoom';

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
          <SimpleRoom />
          <Environment position={[0, 0, 0]} />
          <Character position={[0, 0, 0]} scale={1} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          maxDistance={15}
          minDistance={2}
          maxPolarAngle={Math.PI / 2}
        />
        <ContactShadows
          position={[0, -0.001, 0]}
          opacity={0.6}
          scale={20}
          blur={2.5}
          far={10}
        />
        <Stats />
      </Canvas>
    </>
  );
}
