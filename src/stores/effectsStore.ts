import { create } from 'zustand';

export type EffectsState = {
  enabled: boolean;
  bloom: {
    enabled: boolean;
    intensity: number; // 0.0 - 2.0
    threshold: number; // 0.0 - 1.0
    smoothing: number; // 0.0 - 1.0
  };
  vignette: {
    enabled: boolean;
    eskil: boolean;
    opacity: number; // 0.0 - 1.0
  };
  setEnabled: (v: boolean) => void;
  setBloom: (p: Partial<EffectsState['bloom']>) => void;
  setVignette: (p: Partial<EffectsState['vignette']>) => void;
};

export const useEffectsStore = create<EffectsState>()((set) => ({
  enabled: true,
  bloom: { enabled: true, intensity: 0.3, threshold: 0.9, smoothing: 0.03 },
  vignette: { enabled: true, eskil: false, opacity: 0.3 },
  setEnabled: (v) => set({ enabled: v }),
  setBloom: (p) => set((s) => ({ bloom: { ...s.bloom, ...p } })),
  setVignette: (p) => set((s) => ({ vignette: { ...s.vignette, ...p } })),
}));
