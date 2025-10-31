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
