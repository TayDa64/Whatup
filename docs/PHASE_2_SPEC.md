# Phase 2 Implementation Spec: Asset Import Pipeline

## Agent: Phase2_Assets_Agent

## Objective
Establish a robust asset import pipeline for 3D models (characters and environments). Replace the test cube with an actual character model and add an environment scene. Implement asset loading optimization and error handling.

## Prerequisites
- Phase 1 completed successfully
- Three.js scene rendering at 60fps
- HUD system functional

## Dependencies to Install
```bash
npm install @react-three/drei
npm install three-stdlib
npm install zustand
```

## Asset Requirements

### Character Model
- **Format:** `.glb` or `.gltf`
- **Polygon Count:** 10k-30k triangles
- **Textures:** PBR materials (BaseColor, Normal, Roughness, Metallic)
- **Armature:** Rigged with humanoid skeleton
- **Animations:** Idle, Walk, Talk (optional for Phase 2, required later)
- **Recommended Sources:**
  - Mixamo (free rigged characters)
  - Sketchfab (CC licensed)
  - ReadyPlayerMe (customizable avatars)

### Environment Model
- **Format:** `.glb` or `.gltf`
- **Polygon Count:** 50k-100k triangles max
- **Scale:** 10-20 units wide (Three.js units)
- **Style:** Low-poly or stylized (match Afterparty aesthetic)
- **Lighting:** Include baked ambient occlusion
- **Recommended Themes:** Bar interior, alley, apartment, party venue

## File Structure to Create
```
src/
├── components/
│   ├── Scene/
│   │   ├── Character.tsx           # Character model component
│   │   ├── Environment.tsx         # Environment model component
│   │   ├── ModelLoader.tsx         # Reusable GLTF loader
│   │   └── LoadingScreen.tsx       # Asset loading UI
│   └── Scene/
│       └── GameScene.tsx           # Update to use new assets
├── systems/
│   └── assets/
│       ├── AssetLoader.ts          # Asset management system
│       ├── AssetCache.ts           # Cache loaded models
│       └── types.ts                # Asset type definitions
├── stores/
│   └── assetStore.ts               # Asset loading state
├── assets/
│   ├── models/
│   │   ├── character.glb           # Main character model
│   │   └── environment.glb         # Environment model
│   └── textures/
│       └── .gitkeep                # Placeholder for textures
├── utils/
│   └── blenderPipeline.md          # Blender export guide
└── hooks/
    └── useGLTF.ts                  # Custom hook for loading models
```

## Implementation Steps

### Step 1: Download and Prepare Assets

**Asset Acquisition:**
1. **Character Model:**
   - Go to Mixamo (www.mixamo.com)
   - Select character (e.g., "Remy" or "Claire")
   - Download without animation: Format = FBX, Pose = T-pose
   - OR download from Sketchfab with CC license

2. **Environment Model:**
   - Sketchfab: Search "low poly bar" or "apartment interior"
   - Poly Haven: Interior scenes
   - Ensure CC0 or CC-BY license

**Blender Processing Workflow:**

Create documentation file first:

**`src/utils/blenderPipeline.md`:**
```markdown
# Blender Asset Pipeline for Whatup

## Character Model Processing

1. **Import to Blender:**
   - File > Import > FBX/GLTF
   - Check "Automatic Bone Orientation" if FBX

2. **Cleanup:**
   - Delete unnecessary objects (cameras, lights)
   - Check mesh: Faces should be ~10k-30k
   - Apply all transforms: Ctrl+A > All Transforms
   - Set origin to 3D cursor: Object > Set Origin > Origin to 3D Cursor

3. **Optimize Textures:**
   - Shading workspace
   - Ensure all textures are < 2048x2048
   - Convert to JPEG if PNG > 1MB (except normal maps)
   - Use Shader Editor: Principled BSDF only

4. **Scale:**
   - Character should be ~2 units tall
   - Use Dimensions panel: Scale to 2m height

5. **Export:**
   - File > Export > glTF 2.0
   - Format: glTF Binary (.glb)
   - Check: Include > Cameras/Lights = OFF
   - Check: Transform > +Y Up
   - Check: Geometry > Apply Modifiers
   - Check: Geometry > UVs, Normals, Tangents
   - Check: Compression > Draco OFF (better compatibility)
   - Save to: `src/assets/models/character.glb`

## Environment Model Processing

1. **Import and Cleanup:**
   - Same as character import
   - Remove duplicate materials
   - Merge by distance: vertices closer than 0.001

2. **Lightmap Baking (Optional):**
   - Add Sun lamp
   - Set ambient occlusion in World settings
   - Switch to Cycles renderer
   - Select all meshes > UV > Lightmap Pack
   - Bake: Bake Type = Combined, Margin = 4px

3. **Scale:**
   - Environment should fit within 20x20 unit square
   - Player spawn should be at (0, 0, 0)

4. **Export:**
   - Same settings as character
   - Save to: `src/assets/models/environment.glb`

## Validation Checklist
- [ ] No console errors when loading in Three.js
- [ ] Model appears correctly oriented (+Y up)
- [ ] Textures load and display properly
- [ ] FPS remains > 50 with both models loaded
```

### Step 2: Create Asset Management System

**`src/systems/assets/types.ts`:**
```typescript
import type { GLTF } from 'three-stdlib';

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
```

**`src/systems/assets/AssetCache.ts`:**
```typescript
import type { GLTF } from 'three-stdlib';
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
    const asset = this.cache.get(id);
    if (asset) {
      // Dispose of Three.js resources
      asset.gltf.scene.traverse((child: any) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      this.cache.delete(id);
    }
  }

  clear(): void {
    this.cache.forEach((_, id) => this.remove(id));
  }

  size(): number {
    return this.cache.size;
  }
}

export const assetCache = new AssetCache();
```

**`src/systems/assets/AssetLoader.ts`:**
```typescript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { GLTF } from 'three-stdlib';
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
    // Check cache first
    if (assetCache.has(asset.id)) {
      const cached = assetCache.get(asset.id);
      if (cached) return cached;
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        asset.path,
        (gltf) => {
          assetCache.set(asset.id, gltf);
          resolve(gltf);
        },
        (progressEvent) => {
          if (onProgress && progressEvent.lengthComputable) {
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              item: asset.id,
            });
          }
        },
        (error) => {
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
    const promises = assets.map((asset) => this.loadAsset(asset, onProgress));
    return Promise.all(promises);
  }

  dispose(): void {
    assetCache.clear();
    this.dracoLoader.dispose();
  }
}

export const assetLoader = new AssetLoader();

// Asset definitions
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
```

### Step 3: Create Asset Store

**`src/stores/assetStore.ts`:**
```typescript
import { create } from 'zustand';
import type { GLTF } from 'three-stdlib';

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

export const useAssetStore = create<AssetState>((set) => ({
  assets: {},
  isLoading: true,
  loadProgress: 0,
  currentAsset: '',
  error: null,
  setAsset: (id: string, gltf: GLTF) =>
    set((state) => ({
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
}));
```

### Step 4: Create Custom Hook

**`src/hooks/useGLTF.ts`:**
```typescript
import { useEffect, useState } from 'react';
import type { GLTF } from 'three-stdlib';
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
        const percentage = (progress.loaded / progress.total) * 100;
        setProgress(percentage, assetDef.id);
      })
      .then((loadedGltf) => {
        if (!cancelled) {
          setGltf(loadedGltf);
          setAsset(assetDef.id, loadedGltf);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(`Failed to load ${assetDef.id}: ${error.message}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [assetDef.id]);

  return gltf;
}
```

### Step 5: Create Model Components

**`src/components/Scene/Character.tsx`:**
```typescript
import { useEffect, useRef } from 'react';
import { useGLTF } from '../../hooks/useGLTF';
import { ASSETS } from '../../systems/assets/AssetLoader';
import type * as THREE from 'three';

interface CharacterProps {
  position?: [number, number, number];
  scale?: number;
}

export default function Character({ 
  position = [0, 0, 0], 
  scale = 1 
}: CharacterProps) {
  const characterAsset = ASSETS.find((a) => a.id === 'character')!;
  const gltf = useGLTF(characterAsset);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (gltf && groupRef.current) {
      // Enable shadows
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [gltf]);

  if (!gltf) return null;

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={gltf.scene.clone()} />
    </group>
  );
}
```

**`src/components/Scene/Environment.tsx`:**
```typescript
import { useEffect, useRef } from 'react';
import { useGLTF } from '../../hooks/useGLTF';
import { ASSETS } from '../../systems/assets/AssetLoader';
import type * as THREE from 'three';

interface EnvironmentProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export default function Environment({ 
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}: EnvironmentProps) {
  const environmentAsset = ASSETS.find((a) => a.id === 'environment')!;
  const gltf = useGLTF(environmentAsset);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (gltf && groupRef.current) {
      // Enable shadows
      gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
          child.receiveShadow = true;
          // Environment typically doesn't cast shadows to improve performance
        }
      });
    }
  }, [gltf]);

  if (!gltf) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive object={gltf.scene.clone()} />
    </group>
  );
}
```

**`src/components/Scene/LoadingScreen.tsx`:**
```typescript
import { useAssetStore } from '../../stores/assetStore';

export default function LoadingScreen() {
  const { isLoading, loadProgress, currentAsset, error } = useAssetStore();

  if (!isLoading && !error) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff6b35',
        fontFamily: "'Courier New', monospace",
        zIndex: 1000,
      }}
    >
      {error ? (
        <>
          <h2 style={{ color: '#ff4444' }}>Error Loading Assets</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#ff6b35',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Retry
          </button>
        </>
      ) : (
        <>
          <h2>Loading Whatup...</h2>
          <div
            style={{
              width: '400px',
              height: '20px',
              background: 'rgba(255, 107, 53, 0.2)',
              borderRadius: '10px',
              overflow: 'hidden',
              margin: '20px 0',
            }}
          >
            <div
              style={{
                width: `${loadProgress}%`,
                height: '100%',
                background: '#ff6b35',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <p style={{ opacity: 0.7 }}>
            {currentAsset || 'Preparing assets...'}
          </p>
          <p style={{ fontSize: '12px', opacity: 0.5 }}>
            {Math.round(loadProgress)}%
          </p>
        </>
      )}
    </div>
  );
}
```

### Step 6: Update GameScene

**Update `src/components/Scene/GameScene.tsx`:**
```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Lighting from './Lighting';
import Character from './Character';
import Environment from './Environment';
import LoadingScreen from './LoadingScreen';
import { Suspense } from 'react';

export default function GameScene() {
  return (
    <>
      <LoadingScreen />
      <Canvas
        shadows
        camera={{ position: [5, 2, 5], fov: 50 }}
        style={{ width: '100vw', height: '100vh' }}
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
      </Canvas>
    </>
  );
}
```

### Step 7: Copy Assets to Public Folder

**Important:** Create `public/models/` directory and place your `.glb` files there:

```bash
mkdir public\models
# Copy character.glb and environment.glb to public\models\
```

If you don't have models yet, you can use placeholder URLs temporarily:

**Create `public/models/README.md`:**
```markdown
# Model Assets

Place the following files in this directory:
- character.glb (10-30k polys)
- environment.glb (50-100k polys)

## Temporary Placeholders

For testing without assets, use these free models:

**Character:**
https://models.readyplayer.me/[YOUR_AVATAR_ID].glb

**Environment:**
https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/Sponza/glTF/Sponza.gltf

Update paths in AssetLoader.ts accordingly.
```

## Validation Checklist

Before marking phase complete, verify:

- [ ] Character model loads and displays correctly
- [ ] Environment model loads and displays correctly
- [ ] Loading screen shows progress during asset load
- [ ] Loading screen disappears when assets ready
- [ ] Shadows render on character and environment
- [ ] FPS remains above 50 with both models loaded
- [ ] OrbitControls work smoothly around models
- [ ] No console errors or warnings
- [ ] Asset cache prevents redundant loads
- [ ] Error handling works (test with invalid path)
- [ ] Build completes: `npm run build`
- [ ] Models properly scaled (character ~2 units tall)
- [ ] Textures display correctly
- [ ] Git commit: `feat(phase2): implement asset import pipeline with character and environment`

## Acceptance Criteria

✅ **Functional Requirements:**
1. GLTF loader successfully loads character model
2. GLTF loader successfully loads environment model
3. Loading screen displays during asset loading
4. Progress bar updates in real-time
5. Error screen appears on load failure with retry option
6. Assets cached to prevent redundant network requests
7. Models render with proper shadows and materials

✅ **Technical Requirements:**
1. Asset loading is asynchronous and non-blocking
2. Three.js resources properly disposed on unmount
3. DRACO compression support enabled
4. TypeScript types correct for all GLTF objects
5. Suspense boundary prevents render blocking
6. Memory usage stays under 500MB with assets loaded

✅ **Performance Requirements:**
1. Initial load time < 10 seconds on 3G
2. FPS maintains 50+ with assets rendered
3. Asset files under 5MB each (compressed)
4. Texture resolution appropriate (max 2048x2048)

## Common Issues & Solutions

**Issue:** Model doesn't appear
- **Solution:** Check browser console for 404 errors. Verify files in `public/models/`. Check CORS if loading from external URL.

**Issue:** Model appears black/unlit
- **Solution:** Ensure scene has lights. Check materials use Principled BSDF. Verify normals aren't inverted in Blender.

**Issue:** FPS drops below 30
- **Solution:** Reduce polygon count. Optimize textures (lower resolution). Check for redundant objects in scene hierarchy.

**Issue:** Loading progress stuck at 0%
- **Solution:** Check `progressEvent.lengthComputable`. Server may not send Content-Length header. Use loaded bytes instead.

**Issue:** Character too large/small
- **Solution:** Adjust scale prop on Character component. Re-export from Blender with correct scale (2 units = 2m).

**Issue:** Textures appear pixelated
- **Solution:** Increase texture resolution in Blender export. Ensure anisotropic filtering enabled in Three.js.

## Handoff to Next Phase

Once validated, create handoff document:

```markdown
## Phase 2 Complete

**Delivered:**
- GLTF asset loading system with caching
- Character model rendered in scene
- Environment model rendered in scene
- Loading screen with progress bar
- Error handling with retry mechanism
- Blender asset pipeline documentation

**Assets in Scene:**
- Character at (0, 0, 0)
- Environment at (0, 0, 0)
- All meshes have shadow support

**Integration Points:**
- AssetLoader.ts ready for additional assets
- Character component ready for animation system
- Environment component ready for interaction markers

**Performance Metrics:**
- Current FPS: [XX]fps
- Asset load time: [X]s
- Memory usage: [XXX]MB

**Next Agent Notes:**
- Add post-processing effects to enhance visual quality
- Character animation system will hook into Character component
- Consider LOD system if performance drops
```

Commit changes:
```bash
git add .
git commit -m "feat(phase2): implement asset import pipeline with character and environment models"
git tag phase2-complete
```

## Estimated Time
**6-8 hours** including asset preparation in Blender.
