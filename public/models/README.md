# Model Assets

Place the following files in this directory:
- `character.glb` (10–30k polys)
- `environment.glb` (50–100k polys)

## Current placeholders

- `character.glb` → Fox.glb (Khronos glTF Sample Models, CC BY 4.0)
- `environment.glb` → DamagedHelmet.glb (temporary, CC BY 4.0)

See `CREDITS.md` for attribution.

Note: You can also use the built-in Procedural Bar environment. Toggle it at runtime in the FX Debug panel (F9) under the “Scene” section.

## Replace with final environment

Use a CC0/CC‑BY “bar interior” GLB if possible. Steps:
1) Download the GLB file
2) Save as `public/models/environment.glb`
3) Update `public/models/CREDITS.md` with source and license
4) In the FX Debug panel, uncheck “Procedural Env” to use the GLB

If your asset host differs, you can adjust paths in `src/systems/assets/AssetLoader.ts`.
