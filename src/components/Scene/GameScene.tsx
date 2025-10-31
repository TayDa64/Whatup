import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, ContactShadows } from '@react-three/drei';
import Lighting from './Lighting';
import Character from './Character';
// import Environment from './Environment';
import LoadingScreen from './LoadingScreen';
// import SimpleRoom from './SimpleRoom';
import BarRoom from './BarRoom';
import PostFX from '../../systems/postprocessing/EffectComposer';
import ToneMappingController from '../../systems/postprocessing/ToneMappingController';
import PerformanceGuard from '../../systems/postprocessing/PerformanceGuard';

export default function GameScene() {
  return (
    <>
      <LoadingScreen />
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [5, 2, 5], fov: 50 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <color attach="background" args={["#1a1a2e"]} />
        <Lighting />

        <Suspense fallback={null}>
          {/* Replace simple room with a richer procedural bar interior */}
          <BarRoom />
          {/* Keep character; skip external environment GLB for now */}
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
        <PostFX />
        <ToneMappingController />
        <PerformanceGuard />
      </Canvas>
    </>
  );
}
