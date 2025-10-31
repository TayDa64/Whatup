# PR #2 Local View: Phase 3 Prep (Post-FX + Tools)

This branch adds a custom post-processing pipeline, tuning controls, and a performance guard, plus an optional procedural bar environment.

## Highlights
- Custom EffectComposer (UnrealBloom + Vignette) without peer conflicts
- Tone mapping controller (None/Linear/Reinhard/Cineon/ACES) + exposure
- FX Debug Panel (F9) with presets (Cinematic/Neon/LowKey/Noir)
- Performance Guard auto-toggles FX based on target FPS (window + cooldown)
- Procedural BarRoom interior (no external assets)
- Scene toggle: Procedural vs GLB environment
- Renderer tuning: sRGB output + soft shadows
- Bundle splitting for better caching (three/r3f/postfx)

## Try It
- Start dev: npm run dev
- Toggle panel: F9 (or use the FX ⚙️ button)
- Switch environment in the panel under "Scene"
- Tweak performance guard: adjust Target FPS, Window, Cooldown

## Notes
- Place a CC0/CC-BY bar GLB at `public/models/environment.glb` and update `public/models/CREDITS.md`.
- See `docs/ENVIRONMENT_ASSET_GUIDE.md` for options and steps.
