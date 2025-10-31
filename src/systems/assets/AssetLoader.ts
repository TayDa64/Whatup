import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { AssetDefinition, LoadProgress } from './types';
import { assetCache } from './AssetCache';

class AssetLoader {
  private gltfLoader: GLTFLoader;

  private dracoLoader: DRACOLoader;

  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
  }

  async loadAsset(
    asset: AssetDefinition,
    onProgress?: (progress: LoadProgress) => void
  ): Promise<GLTF> {
    if (assetCache.has(asset.id)) {
      const cached = assetCache.get(asset.id);
      if (cached) {
        return cached;
      }
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        asset.path,
  (gltf: GLTF) => {
          assetCache.set(asset.id, gltf);
          resolve(gltf);
        },
  (progressEvent: ProgressEvent<EventTarget>) => {
          if (onProgress && progressEvent.lengthComputable) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              item: asset.id,
            });
          }
        },
        (error: unknown) => {
          console.error(`Failed to load asset: ${asset.id}`, error);
          reject(error);
        }
      );
    });
  }

  async loadMultiple(
    assets: AssetDefinition[],
    onProgress?: (progress: LoadProgress) => void
  ): Promise<GLTF[]> {
    return Promise.all(assets.map((asset) => this.loadAsset(asset, onProgress)));
  }

  dispose(): void {
    assetCache.clear();
    this.dracoLoader.dispose();
  }
}

export const assetLoader = new AssetLoader();

export const ASSETS: AssetDefinition[] = [
  {
    id: 'character',
    path: '/models/character.glb',
    type: 'character',
    preload: true,
  },
  {
    id: 'environment',
    path: '/models/environment.glb',
    type: 'environment',
    preload: true,
  },
];
