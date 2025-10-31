import { create } from 'zustand';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface AssetState {
  assets: Record<string, GLTF>;
  isLoading: boolean;
  loadProgress: number;
  currentAsset: string;
  error: string | null;
  setAsset: (id: string, gltf: GLTF) => void;
  setLoading: (loading: boolean) => void;
  setProgress: (progress: number, assetName: string) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type SetState = (
  partial:
    | AssetState
    | Partial<AssetState>
    | ((state: AssetState) => AssetState | Partial<AssetState>),
  replace?: boolean
) => void;

type Creator = (set: SetState) => AssetState;

const creator: Creator = (set) => ({
  assets: {},
  isLoading: true,
  loadProgress: 0,
  currentAsset: '',
  error: null,
  setAsset: (id: string, gltf: GLTF) =>
    set((state: AssetState) => ({
      assets: { ...state.assets, [id]: gltf },
    })),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setProgress: (progress: number, assetName: string) =>
    set({ loadProgress: progress, currentAsset: assetName }),
  setError: (error: string | null) => set({ error, isLoading: false }),
  reset: () =>
    set({
      assets: {},
      isLoading: true,
      loadProgress: 0,
      currentAsset: '',
      error: null,
    }),
});

export const useAssetStore = create<AssetState>()(creator);
