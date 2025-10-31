import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEffectsStore } from '../../stores/effectsStore';

function mapTone(tm: ReturnType<typeof useEffectsStore.getState>['toneMapping']) {
  switch (tm) {
    case 'Linear':
      return THREE.LinearToneMapping;
    case 'Reinhard':
      return THREE.ReinhardToneMapping;
    case 'Cineon':
      return THREE.CineonToneMapping;
    case 'ACES':
      return THREE.ACESFilmicToneMapping;
    case 'None':
    default:
      return THREE.NoToneMapping;
  }
}

export default function ToneMappingController() {
  const { gl } = useThree();
  const toneMapping = useEffectsStore((s) => s.toneMapping);
  const exposure = useEffectsStore((s) => s.exposure);

  useEffect(() => {
    gl.toneMapping = mapTone(toneMapping);
    gl.toneMappingExposure = Math.max(0.1, Math.min(2.0, exposure));
  }, [gl, toneMapping, exposure]);

  return null;
}
