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
  toneMapping: 'None' | 'Linear' | 'Reinhard' | 'Cineon' | 'ACES';
  exposure: number; // 0.1 - 2.0
  setEnabled: (v: boolean) => void;
  setBloom: (p: Partial<EffectsState['bloom']>) => void;
  setVignette: (p: Partial<EffectsState['vignette']>) => void;
  setToneMapping: (v: EffectsState['toneMapping']) => void;
  setExposure: (v: number) => void;
  applyPreset: (preset: 'Cinematic' | 'Neon' | 'LowKey' | 'Reset') => void;
};

export const useEffectsStore = create<EffectsState>()((set) => ({
  enabled: true,
  bloom: { enabled: true, intensity: 0.3, threshold: 0.9, smoothing: 0.03 },
  vignette: { enabled: true, eskil: false, opacity: 0.3 },
  toneMapping: 'ACES',
  exposure: 1.0,
  setEnabled: (v) => set({ enabled: v }),
  setBloom: (p) => set((s) => ({ bloom: { ...s.bloom, ...p } })),
  setVignette: (p) => set((s) => ({ vignette: { ...s.vignette, ...p } })),
  setToneMapping: (v) => set({ toneMapping: v }),
  setExposure: (v) => set({ exposure: v }),
  applyPreset: (preset) =>
    set((s) => {
      switch (preset) {
        case 'Cinematic':
          return {
            enabled: true,
            bloom: { ...s.bloom, enabled: true, intensity: 0.35, threshold: 0.92, smoothing: 0.04 },
            vignette: { ...s.vignette, enabled: true, eskil: false, opacity: 0.35 },
            toneMapping: 'ACES',
            exposure: 1.1,
          };
        case 'Neon':
          return {
            enabled: true,
            bloom: { ...s.bloom, enabled: true, intensity: 0.6, threshold: 0.8, smoothing: 0.15 },
            vignette: { ...s.vignette, enabled: true, eskil: true, opacity: 0.4 },
            toneMapping: 'Reinhard',
            exposure: 1.2,
          };
        case 'LowKey':
          return {
            enabled: true,
            bloom: { ...s.bloom, enabled: true, intensity: 0.15, threshold: 0.95, smoothing: 0.02 },
            vignette: { ...s.vignette, enabled: true, eskil: false, opacity: 0.5 },
            toneMapping: 'Cineon',
            exposure: 0.9,
          };
        case 'Reset':
        default:
          return {
            enabled: true,
            bloom: { enabled: true, intensity: 0.3, threshold: 0.9, smoothing: 0.03 },
            vignette: { enabled: true, eskil: false, opacity: 0.3 },
            toneMapping: 'ACES',
            exposure: 1.0,
          };
      }
    }),
}));
