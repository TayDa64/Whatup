import { useEffect, useState } from 'react';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { assetLoader } from '../systems/assets/AssetLoader';
import type { AssetDefinition } from '../systems/assets/types';
import { useAssetStore } from '../stores/assetStore';

export function useGLTF(assetDef: AssetDefinition) {
  const [gltf, setGltf] = useState<GLTF | null>(null);
  const { setAsset, setProgress, setError, setLoading } = useAssetStore();

  useEffect(() => {
    let cancelled = false;

    assetLoader
      .loadAsset(assetDef, (progress) => {
        const percentage = progress.total > 0 ? (progress.loaded / progress.total) * 100 : 0;
        setProgress(percentage, progress.item);
      })
      .then((loadedGltf) => {
        if (!cancelled) {
          setGltf(loadedGltf);
          setAsset(assetDef.id, loadedGltf);
          setLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          setError(`Failed to load ${assetDef.id}: ${message}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [assetDef, setAsset, setError, setLoading, setProgress]);

  return gltf;
}
