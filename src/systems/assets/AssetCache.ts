import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { LoadedAsset } from './types';

class AssetCache {
  private cache: Map<string, LoadedAsset> = new Map();

  set(id: string, gltf: GLTF): void {
    this.cache.set(id, {
      id,
      gltf,
      loadedAt: Date.now(),
    });
  }

  get(id: string): GLTF | undefined {
    return this.cache.get(id)?.gltf;
  }

  has(id: string): boolean {
    return this.cache.has(id);
  }

  remove(id: string): void {
    const cachedAsset = this.cache.get(id);
    if (!cachedAsset) {
      return;
    }

    cachedAsset.gltf.scene.traverse((child: any) => {
      if (child.geometry) {
        child.geometry.dispose();
      }

      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material: any) => {
            if (material?.dispose) {
              material.dispose();
            }
          });
        } else if (child.material.dispose) {
          child.material.dispose();
        }
      }
    });

    this.cache.delete(id);
  }

  clear(): void {
    this.cache.forEach((_, id) => this.remove(id));
  }

  size(): number {
    return this.cache.size;
  }
}

export const assetCache = new AssetCache();
