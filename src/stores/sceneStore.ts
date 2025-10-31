import { create } from 'zustand';

type SceneState = {
  useProceduralEnv: boolean;
  setUseProceduralEnv: (v: boolean) => void;
};

export const useSceneStore = create<SceneState>()((set) => ({
  useProceduralEnv: true,
  setUseProceduralEnv: (v) => set({ useProceduralEnv: v }),
}));
