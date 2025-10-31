import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface AssetDefinition {
  id: string;
  path: string;
  type: 'character' | 'environment' | 'prop';
  preload: boolean;
}

export interface LoadedAsset {
  id: string;
  gltf: GLTF;
  loadedAt: number;
}

export interface LoadProgress {
  loaded: number;
  total: number;
  item: string;
}
