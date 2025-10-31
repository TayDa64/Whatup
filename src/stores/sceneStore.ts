import { create } from 'zustand';

type SceneState = {
  useProceduralEnv: boolean;
  envScale: number;
  setUseProceduralEnv: (v: boolean) => void;
  setEnvScale: (v: number) => void;
};

export const useSceneStore = create<SceneState>()((set) => ({
  useProceduralEnv: true,
  envScale: 1,
  setUseProceduralEnv: (v) => set({ useProceduralEnv: v }),
  setEnvScale: (v) => set({ envScale: v }),
}));
