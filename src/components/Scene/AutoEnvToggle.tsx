import { useEffect, useRef } from 'react';
import { ASSETS } from '../../systems/assets/AssetLoader';
import { useGLTF } from '../../hooks/useGLTF';
import { useSceneStore } from '../../stores/sceneStore';

// If an environment GLB is present and loads successfully, automatically
// switch from the procedural environment to the GLB once (no further flips).
export default function AutoEnvToggle() {
  const { useProceduralEnv, setUseProceduralEnv } = useSceneStore();
  const assetDef = ASSETS.find((a) => a.id === 'environment');
  const gltf = assetDef ? useGLTF(assetDef) : null;
  const switchedRef = useRef(false);

  useEffect(() => {
    if (!gltf || switchedRef.current) return;
    // Only auto-switch if the user hasn't already chosen GLB themselves
    if (useProceduralEnv) {
      setUseProceduralEnv(false);
      switchedRef.current = true;
    }
  }, [gltf, useProceduralEnv, setUseProceduralEnv]);

  return null;
}
