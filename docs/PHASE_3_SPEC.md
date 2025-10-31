# Phase 3 Implementation Spec: Post-Processing Effects

## Agent: Phase3_PostProcessing_Agent

## Objective
Implement cinematic post-processing effects to achieve Afterparty's distinctive visual style: neon-lit environments, atmospheric depth, and stylized rendering. Add bloom, depth of field, color grading, vignette, chromatic aberration, and film grain.

## Prerequisites
- Phase 1 and 2 completed
- Character and environment assets rendering
- Scene maintains 60fps baseline

## Dependencies to Install
```bash
npm install postprocessing
npm install lil-gui
```

## Visual Reference
Afterparty style characteristics:
- High contrast neon colors (pink, cyan, purple)
- Strong bloom on light sources
- Subtle depth of field for cinematic feel
- Warm color grading with cooled shadows
- Film grain for indie aesthetic
- Slight chromatic aberration for analog look

## File Structure to Create
```
src/
├── systems/
│   └── postprocessing/
│       ├── EffectComposer.tsx     # Main composer setup
│       ├── effects/
│       │   ├── BloomEffect.tsx    # Bloom configuration
│       │   ├── ColorGradingEffect.tsx
│       │   ├── VignetteEffect.tsx
│       │   ├── ChromaticAberrationEffect.tsx
│       │   └── FilmGrainEffect.tsx
│       ├── presets.ts             # Effect presets (day/night/party)
│       └── types.ts               # Post-processing types
├── components/
│   └── Scene/
│       ├── GameScene.tsx          # Update with effects
│       └── DebugPanel.tsx         # GUI for effect tweaking
└── stores/
    └── effectsStore.ts            # Effect settings state
```

## Implementation Steps

### Step 1: Create Effect Types and Store

**`src/systems/postprocessing/types.ts`:**
```typescript
export interface BloomSettings {
  intensity: number;
  luminanceThreshold: number;
  luminanceSmoothing: number;
  mipmapBlur: boolean;
}

export interface ColorGradingSettings {
  exposure: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
}

export interface DepthOfFieldSettings {
  focusDistance: number;
  focalLength: number;
  bokehScale: number;
}

export interface VignetteSettings {
  offset: number;
  darkness: number;
}

export interface ChromaticAberrationSettings {
  offset: number;
}

export interface FilmGrainSettings {
  intensity: number;
}

export interface PostProcessingSettings {
  enabled: boolean;
  bloom: BloomSettings;
  colorGrading: ColorGradingSettings;
  depthOfField: DepthOfFieldSettings;
  vignette: VignetteSettings;
  chromaticAberration: ChromaticAberrationSettings;
  filmGrain: FilmGrainSettings;
  preset: 'default' | 'party' | 'dramatic' | 'minimal';
}
```

**`src/stores/effectsStore.ts`:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PostProcessingSettings } from '../systems/postprocessing/types';

interface EffectsState {
  settings: PostProcessingSettings;
  updateBloom: (bloom: Partial<PostProcessingSettings['bloom']>) => void;
  updateColorGrading: (grading: Partial<PostProcessingSettings['colorGrading']>) => void;
  updateDepthOfField: (dof: Partial<PostProcessingSettings['depthOfField']>) => void;
  updateVignette: (vignette: Partial<PostProcessingSettings['vignette']>) => void;
  updateChromaticAberration: (ca: Partial<PostProcessingSettings['chromaticAberration']>) => void;
  updateFilmGrain: (grain: Partial<PostProcessingSettings['filmGrain']>) => void;
  setPreset: (preset: PostProcessingSettings['preset']) => void;
  toggleEffects: () => void;
  reset: () => void;
}

const defaultSettings: PostProcessingSettings = {
  enabled: true,
  bloom: {
    intensity: 1.5,
    luminanceThreshold: 0.3,
    luminanceSmoothing: 0.9,
    mipmapBlur: true,
  },
  colorGrading: {
    exposure: 0.2,
    contrast: 1.1,
    saturation: 1.2,
    temperature: 0.1,
    tint: 0.05,
  },
  depthOfField: {
    focusDistance: 5,
    focalLength: 0.02,
    bokehScale: 2.0,
  },
  vignette: {
    offset: 0.5,
    darkness: 0.5,
  },
  chromaticAberration: {
    offset: 0.001,
  },
  filmGrain: {
    intensity: 0.1,
  },
  preset: 'default',
};

export const useEffectsStore = create<EffectsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateBloom: (bloom) =>
        set((state) => ({
          settings: {
            ...state.settings,
            bloom: { ...state.settings.bloom, ...bloom },
          },
        })),
      updateColorGrading: (grading) =>
        set((state) => ({
          settings: {
            ...state.settings,
            colorGrading: { ...state.settings.colorGrading, ...grading },
          },
        })),
      updateDepthOfField: (dof) =>
        set((state) => ({
          settings: {
            ...state.settings,
            depthOfField: { ...state.settings.depthOfField, ...dof },
          },
        })),
      updateVignette: (vignette) =>
        set((state) => ({
          settings: {
            ...state.settings,
            vignette: { ...state.settings.vignette, ...vignette },
          },
        })),
      updateChromaticAberration: (ca) =>
        set((state) => ({
          settings: {
            ...state.settings,
            chromaticAberration: { ...state.settings.chromaticAberration, ...ca },
          },
        })),
      updateFilmGrain: (grain) =>
        set((state) => ({
          settings: {
            ...state.settings,
            filmGrain: { ...state.settings.filmGrain, ...grain },
          },
        })),
      setPreset: (preset) =>
        set({ settings: { ...defaultSettings, preset } }),
      toggleEffects: () =>
        set((state) => ({
          settings: { ...state.settings, enabled: !state.settings.enabled },
        })),
      reset: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'whatup-effects-storage',
    }
  )
);
```

### Step 2: Create Effect Presets

**`src/systems/postprocessing/presets.ts`:**
```typescript
import type { PostProcessingSettings } from './types';

export const EFFECT_PRESETS: Record<string, Partial<PostProcessingSettings>> = {
  default: {
    bloom: {
      intensity: 1.5,
      luminanceThreshold: 0.3,
      luminanceSmoothing: 0.9,
      mipmapBlur: true,
    },
    colorGrading: {
      exposure: 0.2,
      contrast: 1.1,
      saturation: 1.2,
      temperature: 0.1,
      tint: 0.05,
    },
    depthOfField: {
      focusDistance: 5,
      focalLength: 0.02,
      bokehScale: 2.0,
    },
    vignette: {
      offset: 0.5,
      darkness: 0.5,
    },
    chromaticAberration: {
      offset: 0.001,
    },
    filmGrain: {
      intensity: 0.1,
    },
  },
  party: {
    bloom: {
      intensity: 2.5,
      luminanceThreshold: 0.2,
      luminanceSmoothing: 0.8,
      mipmapBlur: true,
    },
    colorGrading: {
      exposure: 0.4,
      contrast: 1.3,
      saturation: 1.5,
      temperature: 0.3,
      tint: 0.15,
    },
    depthOfField: {
      focusDistance: 4,
      focalLength: 0.04,
      bokehScale: 3.0,
    },
    vignette: {
      offset: 0.3,
      darkness: 0.7,
    },
    chromaticAberration: {
      offset: 0.002,
    },
    filmGrain: {
      intensity: 0.15,
    },
  },
  dramatic: {
    bloom: {
      intensity: 1.0,
      luminanceThreshold: 0.5,
      luminanceSmoothing: 1.0,
      mipmapBlur: true,
    },
    colorGrading: {
      exposure: 0.0,
      contrast: 1.4,
      saturation: 0.9,
      temperature: -0.1,
      tint: -0.05,
    },
    depthOfField: {
      focusDistance: 6,
      focalLength: 0.05,
      bokehScale: 4.0,
    },
    vignette: {
      offset: 0.4,
      darkness: 0.8,
    },
    chromaticAberration: {
      offset: 0.0005,
    },
    filmGrain: {
      intensity: 0.2,
    },
  },
  minimal: {
    bloom: {
      intensity: 0.8,
      luminanceThreshold: 0.4,
      luminanceSmoothing: 0.95,
      mipmapBlur: false,
    },
    colorGrading: {
      exposure: 0.1,
      contrast: 1.0,
      saturation: 1.0,
      temperature: 0.0,
      tint: 0.0,
    },
    depthOfField: {
      focusDistance: 10,
      focalLength: 0.01,
      bokehScale: 1.0,
    },
    vignette: {
      offset: 0.6,
      darkness: 0.3,
    },
    chromaticAberration: {
      offset: 0.0,
    },
    filmGrain: {
      intensity: 0.05,
    },
  },
};
```

### Step 3: Create Effect Composer

**`src/systems/postprocessing/EffectComposer.tsx`:**
```typescript
import { useEffect, useRef } from 'react';
import { useThree, useFrame, extend } from '@react-three/fiber';
import {
  EffectComposer as PMEffectComposer,
  EffectPass,
  RenderPass,
  BloomEffect,
  DepthOfFieldEffect,
  VignetteEffect,
  ChromaticAberrationEffect,
  NoiseEffect,
  ToneMappingEffect,
  BlendFunction,
} from 'postprocessing';
import { useEffectsStore } from '../../stores/effectsStore';

// Extend React Three Fiber to recognize postprocessing classes
extend({ PMEffectComposer, RenderPass, EffectPass });

export default function EffectComposer() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<PMEffectComposer | null>(null);
  const { settings } = useEffectsStore();

  useEffect(() => {
    // Initialize composer
    const effectComposer = new PMEffectComposer(gl, {
      frameBufferType: THREE.HalfFloatType,
    });
    effectComposer.addPass(new RenderPass(scene, camera));

    // Bloom Effect
    const bloomEffect = new BloomEffect({
      intensity: settings.bloom.intensity,
      luminanceThreshold: settings.bloom.luminanceThreshold,
      luminanceSmoothing: settings.bloom.luminanceSmoothing,
      mipmapBlur: settings.bloom.mipmapBlur,
      blendFunction: BlendFunction.ADD,
    });

    // Depth of Field Effect
    const depthOfFieldEffect = new DepthOfFieldEffect(camera, {
      focusDistance: settings.depthOfField.focusDistance,
      focalLength: settings.depthOfField.focalLength,
      bokehScale: settings.depthOfField.bokehScale,
      height: 480,
    });

    // Vignette Effect
    const vignetteEffect = new VignetteEffect({
      offset: settings.vignette.offset,
      darkness: settings.vignette.darkness,
    });

    // Chromatic Aberration Effect
    const chromaticAberrationEffect = new ChromaticAberrationEffect({
      offset: { x: settings.chromaticAberration.offset, y: settings.chromaticAberration.offset },
    });

    // Film Grain (Noise) Effect
    const filmGrainEffect = new NoiseEffect({
      blendFunction: BlendFunction.OVERLAY,
    });
    filmGrainEffect.blendMode.opacity.value = settings.filmGrain.intensity;

    // Tone Mapping (for color grading)
    const toneMappingEffect = new ToneMappingEffect({
      mode: THREE.ACESFilmicToneMapping,
      resolution: 256,
      maxLuminance: 16.0,
      whitePoint: 16.0,
      middleGrey: 0.6,
      minLuminance: 0.01,
      averageLuminance: 1.0,
      adaptationRate: 1.0,
    });

    // Combine effects
    const effectPass = new EffectPass(
      camera,
      bloomEffect,
      depthOfFieldEffect,
      vignetteEffect,
      chromaticAberrationEffect,
      filmGrainEffect,
      toneMappingEffect
    );

    effectComposer.addPass(effectPass);
    composer.current = effectComposer;

    return () => {
      effectComposer.dispose();
    };
  }, [gl, scene, camera]);

  // Update composer on resize
  useEffect(() => {
    if (composer.current) {
      composer.current.setSize(size.width, size.height);
    }
  }, [size]);

  // Update effects on settings change
  useEffect(() => {
    if (!composer.current) return;

    const passes = composer.current.passes;
    const effectPass = passes.find((pass) => pass instanceof EffectPass) as EffectPass | undefined;

    if (effectPass) {
      effectPass.effects.forEach((effect) => {
        if (effect instanceof BloomEffect) {
          effect.intensity = settings.bloom.intensity;
          effect.luminanceMaterial.threshold = settings.bloom.luminanceThreshold;
          effect.luminanceMaterial.smoothing = settings.bloom.luminanceSmoothing;
        }
        if (effect instanceof DepthOfFieldEffect) {
          effect.circleOfConfusionMaterial.uniforms.focusDistance.value =
            settings.depthOfField.focusDistance;
          effect.circleOfConfusionMaterial.uniforms.focalLength.value =
            settings.depthOfField.focalLength;
          effect.bokehScale = settings.depthOfField.bokehScale;
        }
        if (effect instanceof VignetteEffect) {
          effect.uniforms.get('offset')!.value = settings.vignette.offset;
          effect.uniforms.get('darkness')!.value = settings.vignette.darkness;
        }
        if (effect instanceof ChromaticAberrationEffect) {
          effect.offset.set(
            settings.chromaticAberration.offset,
            settings.chromaticAberration.offset
          );
        }
        if (effect instanceof NoiseEffect) {
          effect.blendMode.opacity.value = settings.filmGrain.intensity;
        }
      });
    }
  }, [settings]);

  // Render with composer
  useFrame(() => {
    if (composer.current && settings.enabled) {
      composer.current.render();
    }
  }, 1);

  return null;
}
```

### Step 4: Create Debug Panel

**`src/components/Scene/DebugPanel.tsx`:**
```typescript
import { useEffect } from 'react';
import { GUI } from 'lil-gui';
import { useEffectsStore } from '../../stores/effectsStore';
import { EFFECT_PRESETS } from '../../systems/postprocessing/presets';

let gui: GUI | null = null;

export default function DebugPanel() {
  const {
    settings,
    updateBloom,
    updateColorGrading,
    updateDepthOfField,
    updateVignette,
    updateChromaticAberration,
    updateFilmGrain,
    setPreset,
    toggleEffects,
  } = useEffectsStore();

  useEffect(() => {
    // Only show in development
    if (import.meta.env.PROD) return;

    gui = new GUI({ title: 'Post-Processing' });

    // Presets
    const presetsFolder = gui.addFolder('Presets');
    const presetController = {
      preset: settings.preset,
    };
    presetsFolder
      .add(presetController, 'preset', ['default', 'party', 'dramatic', 'minimal'])
      .onChange((value: string) => {
        setPreset(value as any);
        location.reload(); // Simple way to apply preset
      });

    // Master toggle
    const toggleController = { enabled: settings.enabled };
    gui.add(toggleController, 'enabled').onChange(toggleEffects).name('Enable Effects');

    // Bloom
    const bloomFolder = gui.addFolder('Bloom');
    bloomFolder
      .add(settings.bloom, 'intensity', 0, 5, 0.1)
      .onChange((v: number) => updateBloom({ intensity: v }));
    bloomFolder
      .add(settings.bloom, 'luminanceThreshold', 0, 1, 0.01)
      .onChange((v: number) => updateBloom({ luminanceThreshold: v }));
    bloomFolder
      .add(settings.bloom, 'luminanceSmoothing', 0, 1, 0.01)
      .onChange((v: number) => updateBloom({ luminanceSmoothing: v }));

    // Depth of Field
    const dofFolder = gui.addFolder('Depth of Field');
    dofFolder
      .add(settings.depthOfField, 'focusDistance', 0, 20, 0.1)
      .onChange((v: number) => updateDepthOfField({ focusDistance: v }));
    dofFolder
      .add(settings.depthOfField, 'focalLength', 0, 0.1, 0.001)
      .onChange((v: number) => updateDepthOfField({ focalLength: v }));
    dofFolder
      .add(settings.depthOfField, 'bokehScale', 0, 10, 0.1)
      .onChange((v: number) => updateDepthOfField({ bokehScale: v }));

    // Vignette
    const vignetteFolder = gui.addFolder('Vignette');
    vignetteFolder
      .add(settings.vignette, 'offset', 0, 1, 0.01)
      .onChange((v: number) => updateVignette({ offset: v }));
    vignetteFolder
      .add(settings.vignette, 'darkness', 0, 1, 0.01)
      .onChange((v: number) => updateVignette({ darkness: v }));

    // Chromatic Aberration
    const caFolder = gui.addFolder('Chromatic Aberration');
    caFolder
      .add(settings.chromaticAberration, 'offset', 0, 0.01, 0.0001)
      .onChange((v: number) => updateChromaticAberration({ offset: v }));

    // Film Grain
    const grainFolder = gui.addFolder('Film Grain');
    grainFolder
      .add(settings.filmGrain, 'intensity', 0, 1, 0.01)
      .onChange((v: number) => updateFilmGrain({ intensity: v }));

    // Color Grading
    const cgFolder = gui.addFolder('Color Grading');
    cgFolder
      .add(settings.colorGrading, 'exposure', -1, 1, 0.01)
      .onChange((v: number) => updateColorGrading({ exposure: v }));
    cgFolder
      .add(settings.colorGrading, 'contrast', 0, 2, 0.01)
      .onChange((v: number) => updateColorGrading({ contrast: v }));
    cgFolder
      .add(settings.colorGrading, 'saturation', 0, 2, 0.01)
      .onChange((v: number) => updateColorGrading({ saturation: v }));

    return () => {
      if (gui) {
        gui.destroy();
        gui = null;
      }
    };
  }, []);

  return null;
}
```

### Step 5: Update GameScene

**Update `src/components/Scene/GameScene.tsx`:**
```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Suspense } from 'react';
import Lighting from './Lighting';
import Character from './Character';
import Environment from './Environment';
import LoadingScreen from './LoadingScreen';
import EffectComposer from '../../systems/postprocessing/EffectComposer';
import DebugPanel from './DebugPanel';

export default function GameScene() {
  return (
    <>
      <LoadingScreen />
      <DebugPanel />
      <Canvas
        shadows
        camera={{ position: [5, 2, 5], fov: 50 }}
        style={{ width: '100vw', height: '100vh' }}
        gl={{
          antialias: false, // Disable built-in AA, use post-processing instead
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#1a1a2e']} />
        <Lighting />

        <Suspense fallback={null}>
          <Environment position={[0, 0, 0]} />
          <Character position={[0, 0, 0]} scale={1} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          maxDistance={15}
          minDistance={2}
          maxPolarAngle={Math.PI / 2}
        />
        <Stats />
        
        <EffectComposer />
      </Canvas>
    </>
  );
}
```

### Step 6: Enhance Lighting for Better Effects

**Update `src/components/Scene/Lighting.tsx`:**
```typescript
export default function Lighting() {
  return (
    <>
      {/* Ambient base light */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Key light */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Neon accent lights for bloom effect */}
      <pointLight 
        position={[-3, 2, -3]} 
        intensity={2.0} 
        color="#ff00ff" 
        distance={10}
      />
      <pointLight 
        position={[3, 2, 3]} 
        intensity={2.0} 
        color="#00ffff" 
        distance={10}
      />
      
      {/* Rim light */}
      <spotLight
        position={[0, 5, -8]}
        angle={0.6}
        penumbra={0.5}
        intensity={1.0}
        color="#ff6b35"
        castShadow
      />
    </>
  );
}
```

### Step 7: Add Performance Monitoring

**Create `src/utils/performanceMonitor.ts`:**
```typescript
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;

  update(): number {
    this.frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    return this.fps;
  }

  getFPS(): number {
    return this.fps;
  }

  checkPerformance(): 'good' | 'medium' | 'poor' {
    if (this.fps >= 50) return 'good';
    if (this.fps >= 30) return 'medium';
    return 'poor';
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

## Validation Checklist

Before marking phase complete, verify:

- [ ] Bloom effect visible on bright areas and point lights
- [ ] Depth of field creates subtle focus effect
- [ ] Vignette darkens screen edges
- [ ] Chromatic aberration visible at edges (subtle)
- [ ] Film grain adds texture to image
- [ ] Debug panel appears in dev mode (check with `npm run dev`)
- [ ] Effects can be toggled on/off without errors
- [ ] Preset switching works correctly
- [ ] FPS remains above 45 with all effects enabled
- [ ] No console errors or warnings
- [ ] Effects settings persist to localStorage
- [ ] Build completes: `npm run build`
- [ ] Production build excludes debug panel
- [ ] Git commit: `feat(phase3): implement cinematic post-processing effects`

## Acceptance Criteria

✅ **Functional Requirements:**
1. Bloom effect highlights bright areas
2. Depth of field creates focus on character
3. Vignette frames the scene
4. Chromatic aberration adds analog feel
5. Film grain provides texture
6. All effects adjustable via debug panel
7. Effect presets switch seamlessly

✅ **Technical Requirements:**
1. EffectComposer properly initialized
2. Effects update in real-time
3. Settings persist across sessions
4. Performance monitoring integrated
5. WebGL context not lost
6. Memory stable (no leaks)

✅ **Performance Requirements:**
1. FPS > 45 on mid-range hardware
2. Effect rendering adds < 5ms per frame
3. No frame drops when adjusting settings
4. Smooth preset transitions

✅ **Visual Requirements:**
1. Afterparty-style aesthetic achieved
2. Neon colors pop with bloom
3. Scene has cinematic depth
4. Colors feel vibrant but not oversaturated
5. No artifacts or banding

## Common Issues & Solutions

**Issue:** FPS drops significantly with effects
- **Solution:** Reduce bloom resolution, disable mipmapBlur, lower depthOfField height parameter.

**Issue:** Bloom too intense, washes out scene
- **Solution:** Lower bloom intensity, increase luminanceThreshold to 0.4+, reduce light intensities.

**Issue:** Depth of field blurs entire scene
- **Solution:** Adjust focusDistance to match camera distance to character, reduce focalLength.

**Issue:** Chromatic aberration not visible
- **Solution:** Increase offset to 0.003-0.005 temporarily for testing, verify on high-contrast edges.

**Issue:** Effects don't update in real-time
- **Solution:** Check useEffect dependencies, ensure settings are properly passed to effect uniforms.

**Issue:** Debug panel causes errors in production
- **Solution:** Verify `import.meta.env.PROD` check wraps GUI creation.

**Issue:** Scene appears too dark after effects
- **Solution:** Increase colorGrading exposure, boost ambient light, add more point lights.

## Performance Optimization Tips

1. **Bloom**: Most expensive effect. Reduce resolution if needed.
2. **Depth of Field**: Use lower height parameter (240-480 range).
3. **Use HalfFloatType**: Already configured for better performance.
4. **Disable AA in Canvas**: Post-processing provides better AA.
5. **Conditional Effects**: Consider disabling DOF on low-end devices.

## Handoff to Next Phase

Once validated, create handoff document:

```markdown
## Phase 3 Complete

**Delivered:**
- Cinematic post-processing pipeline
- Bloom, DOF, vignette, chromatic aberration, film grain effects
- Debug panel for effect tuning
- Effect presets (default, party, dramatic, minimal)
- Performance monitoring utilities
- Persistent effect settings

**Visual Style Achieved:**
- Afterparty-inspired neon aesthetic
- Cinematic depth and focus
- Stylized indie game look
- Enhanced lighting and atmosphere

**Performance Metrics:**
- Current FPS: [XX]fps (with all effects)
- Frame time: [X]ms
- Effect overhead: ~[X]ms

**Integration Points:**
- EffectsStore ready for dynamic preset switching
- Lighting setup optimized for bloom
- Camera setup tuned for depth of field

**Next Agent Notes:**
- Procedural terrain generation can use existing lighting
- NPC system can trigger effect preset changes (e.g., party mode when entering crowded areas)
- Vehicle system should consider disabling DOF during fast movement
```

Commit changes:
```bash
git add .
git commit -m "feat(phase3): implement cinematic post-processing effects with bloom, DOF, and color grading"
git tag phase3-complete
```

## Estimated Time
**4-6 hours** including effect tuning and optimization.
