# Environment Asset Guide (Bar Interior)

This project prefers open assets (CC0/CC‑BY). Here are safe options and how to integrate them.

## Options

- Kenney.nl (CC0) — Furniture & props
  - Furniture Kit: https://kenney.nl/assets/furniture-kit (CC0)
  - Food Kit: https://kenney.nl/assets/food-kit (CC0)
  - Approach: Keep our procedural walls (BarRoom) and add a few GLB props (tables, bottles, food) for detail. Very light and license‑safe.

- Quaternius (CC0) — Modular packs
  - Homepage: https://quaternius.com/ (navigate to Assets)
  - Approach: Use a modular interiors/props pack to assemble a bar layout. CC0 and very light.

- CC‑BY assets (various) — Single GLB interiors
  - Approach: Find a “bar”/“tavern” interior GLB under CC‑BY 4.0, download the GLB and include attribution in CREDITS.md.
  - Note: Avoid redistributing third‑party files without checking license terms.

## Integration Steps

1) Place your GLB at `public/models/environment.glb`
2) Update `public/models/CREDITS.md` with:
   - Name, Source URL, Direct file URL (if applicable), License
3) In the app, press F9 → FX Debug → Scene → uncheck “Procedural Env”
4) Verify performance:
   - Use Target FPS ~55 (default) in Performance section
   - Adjust Window and Cooldown if FX toggles too aggressively
   - Try presets (Cinematic/Neon/LowKey/Noir) for mood

## Tips
- Keep GLB polygon counts modest (ideally < 100k) and use DRACO if available.
- Baking ambient light into textures helps performance.
- Prefer a few good props over heavy full interiors if you need speed.
