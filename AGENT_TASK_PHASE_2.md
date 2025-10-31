# Phase 2: Asset Import Pipeline - Coding Agent Task

**Branch:** `feature/phase-2-assets`  
**Assigned to:** Coding Agent (Yolo Supervisor)  
**Requires:** Web search enabled

---

## 🎯 Objective

Replace the test cube with actual 3D character and environment models. Implement full asset loading pipeline with progress tracking.

---

## 📋 Task Checklist

### 1. Acquire Assets via Web Search

#### Character Model
- [ ] Search Mixamo (www.mixamo.com) for a free rigged character
- [ ] Download in GLB or FBX format (if FBX, note: needs Blender conversion)
- [ ] Alternative: Search Sketchfab with "CC license downloadable" filter
- [ ] Target specs: 10k-30k polygons, humanoid, ~2m tall
- [ ] Save to: `public/models/character.glb`

**Search Keywords:**
- "Mixamo free character download"
- "Sketchfab free 3D character CC license"
- "Ready Player Me avatar glb"

#### Environment Model  
- [ ] Search Sketchfab for "low poly bar interior" or "apartment"
- [ ] Filter: Downloadable, CC0 or CC-BY license
- [ ] Download GLB format
- [ ] Target specs: 50k-100k polygons, indoor scene, 10-20 units wide
- [ ] Save to: `public/models/environment.glb`

**Search Keywords:**
- "Sketchfab low poly bar interior downloadable"
- "free 3D apartment model CC0"
- "Poly Haven interior scene"

**Quick Test Assets (if needed):**
- Character: `https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb`
- Environment: Khronos glTF sample - https://github.com/KhronosGroup/glTF-Sample-Models

### 2. Compile Ink Dialogue Story

Current `test_story.json` is a placeholder. Must compile the actual story:

```bash
# Install inklecate globally
npm install -g inklecate

# Compile the story
npm run compile-ink
```

This compiles `src/assets/dialogue/test_story.ink` → `src/assets/dialogue/test_story.json`

**Validation:** The JSON should contain actual story data, not just `{"inkVersion": 21, "root": []}`

### 3. Update GameScene.tsx

**File:** `src/components/Scene/GameScene.tsx`

**Current code:**
```tsx
import TestCube from './TestCube';

// In render:
<Suspense fallback={null}>
  <TestCube />
</Suspense>
```

**Change to:**
```tsx
import Character from './Character';
import Environment from './Environment';
import LoadingScreen from './LoadingScreen';

export default function GameScene() {
  return (
    <>
      <LoadingScreen />
      <Canvas
        shadows
        camera={{ position: [5, 2, 5], fov: 50 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <color attach="background" args={["#1a1a2e"]} />
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

**Note:** Remove `<gridHelper>` - environment will provide floor reference

### 4. Test & Validate

Use Live Preview extension to test:

```bash
# Start dev server (background terminal)
npm run dev
```

**Use Live Preview to open:** `http://localhost:5173/`

**Validation Checklist:**
- [ ] Loading screen appears with progress bar
- [ ] Character model loads and displays correctly
- [ ] Environment model loads and displays correctly
- [ ] Loading screen disappears when assets loaded
- [ ] FPS counter shows 50+ fps (check Stats panel)
- [ ] No console errors in browser
- [ ] Dialogue HUD appears at bottom
- [ ] Clicking dialogue choices advances the story
- [ ] OrbitControls allow camera rotation

**If FPS < 50:** Models may be too high-poly. Search for lower-poly alternatives.

### 5. Commit & Push

```bash
git add -A
git commit -m "feat(phase2): implement asset import pipeline with 3D models

- Add character model from [SOURCE]
- Add environment model from [SOURCE]
- Enable LoadingScreen with progress tracking
- Compile Ink dialogue story
- Replace TestCube with actual 3D assets
- Verified 50+ fps performance"

git push origin feature/phase-2-assets
```

---

## 📁 Files Already Prepared (No Changes Needed)

These components are fully implemented and ready to use:

- ✅ `src/components/Scene/Character.tsx` - Loads character from AssetLoader
- ✅ `src/components/Scene/Environment.tsx` - Loads environment from AssetLoader
- ✅ `src/components/Scene/LoadingScreen.tsx` - Shows progress during load
- ✅ `src/hooks/useGLTF.ts` - Custom hook for loading models
- ✅ `src/systems/assets/AssetLoader.ts` - GLTF loader with caching
- ✅ `src/systems/assets/AssetCache.ts` - Caches loaded models
- ✅ `src/stores/assetStore.ts` - Zustand store for asset state

**Asset paths are configured in:** `src/systems/assets/AssetLoader.ts`

```typescript
export const ASSETS: AssetDefinition[] = [
  {
    id: 'character',
    path: '/models/character.glb',  // Looks in public/models/
    type: 'character',
    preload: true,
  },
  {
    id: 'environment',
    path: '/models/environment.glb',  // Looks in public/models/
    type: 'environment',
    preload: true,
  },
];
```

---

## 🔍 Troubleshooting

### Model doesn't appear
- Check browser console for 404 errors
- Verify files exist in `public/models/`
- Check file names match exactly: `character.glb`, `environment.glb`

### Model appears black/unlit
- Try different model from different source
- Check if model has materials (some free models don't include textures)

### Loading screen stuck at 0%
- Ink story may not be compiled - run `npm run compile-ink`
- Check that test_story.json has actual content

### FPS too low
- Models are too high-poly
- Search for "low poly" alternatives
- Target: character < 30k polys, environment < 100k polys

### TypeScript errors
- Run `npm run build` to check
- All types are already configured - should have zero errors

---

## 📚 References

**Full Phase 2 Spec:** `docs/PHASE_2_SPEC.md`  
**Blender Export Guide:** `src/utils/blenderPipeline.md` (if converting FBX to GLB)  
**Phase 1 Handoff:** `PHASE_1_HANDOFF.md`

**Free Asset Sources:**
- Mixamo: https://www.mixamo.com
- Sketchfab: https://sketchfab.com/search?features=downloadable&licenses=322a749bcfa841b29dff1e8a1bb74b0b
- Poly Haven: https://polyhaven.com
- Ready Player Me: https://readyplayer.me

---

## ✅ Definition of Done

- [ ] Two GLB files in `public/models/` directory
- [ ] Ink story compiled (`test_story.json` has content)
- [ ] GameScene.tsx updated to use Character/Environment
- [ ] Dev server tested with Live Preview
- [ ] Loading screen functional
- [ ] FPS ≥ 50 with both models loaded
- [ ] No console errors
- [ ] Dialogue system working
- [ ] Changes committed and pushed to `feature/phase-2-assets`

**Estimated Time:** 2-3 hours (including asset search)

---

## 🤖 Yolo Supervisor Configuration

This task requires:
- ✅ Web search capability (critical for asset discovery)
- ✅ Terminal ID tracking for background processes
- ✅ File creation/modification
- ✅ Git operations
- ✅ Browser/Live Preview access for testing
