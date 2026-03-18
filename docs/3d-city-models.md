# 3D City Model Specification

Artist reference for creating replacement GLB/GLTF models for the Gentleman.Dots portfolio city.

---

## Overview

This document defines the technical requirements for 3D landmark models used in the 3D city scene. These models will replace the current placeholder geometries with artist-created assets.

---

## File Requirements

| Property | Value |
|----------|-------|
| **Format** | Binary glTF 2.0 (`.glb`) |
| **Loader** | THREE.GLTFLoader |
| **Location** | `public/models/` |
| **File Naming** | `profile-hub.glb`, `experience.glb`, `skills.glb`, `showcase.glb` |

---

## Scale & Transform

| Property | Value |
|----------|-------|
| **Unit Scale** | 1 unit = 1 meter |
| **Pivot** | Base center (Y=0 at ground level) |
| **Coordinate System** | Y-up, Z-forward |

---

## Landmark Bounding Boxes

Each model must fit within its designated bounding volume while maintaining visual presence.

| Landmark | Bounding Box (W×D×H) | Geometry Description |
|----------|---------------------|---------------------|
| **Profile Hub** | 1×1×5 m | Central tower with orbital ring element |
| **Experience** | 2×2×4 m | Vertical structure with antenna/mast |
| **Technical Skills** | 1.5×1.5×4 m | Tapered/spire-like form, 4-sided symmetry |
| **Showcase** | 2×2×3 m | Architectural arch or portal structure |

---

## Material Requirements

All models must use **PBR-compatible materials** for proper lighting integration.

### Required Maps

| Map | Type | Purpose |
|-----|------|---------|
| `baseColorTexture` | Color/Albedo | Diffuse color (can be neutral grey if colored via vertex color) |
| `roughnessMetallicTexture` | Grayscale + Metal | PBR surface properties (R=roughness, G=metalness) |

### Optional Maps

| Map | Type | Purpose |
|-----|------|---------|
| `emissiveTexture` | Color | Glow/emission on specific surfaces |
| `normalTexture` | Tangent-space | Surface detail bump mapping |
| `occlusionTexture` | Grayscale | Ambient occlusion |

### Material Notes

- Use `MeshStandardMaterial` equivalents in your 3D software
- Emissive surfaces will receive GT-blue (#00D9FF) tint when no emissive map is provided
- Base color should be neutral (dark grey #2A2A2A recommended) to match placeholder aesthetics

---

## Performance Limits

| Metric | Maximum |
|--------|--------|
| **Triangles** | 3,000 per model |
| **Texture Resolution** | 1024×1024 px (each map) |

### Optimization Tips

- Use baked lighting where possible
- Prefer normal maps over geometry for surface detail
- Share materials across similar elements
- Remove internal/hidden faces

---

## Animation (Optional)

If the model includes animation:

| Property | Value |
|----------|-------|
| **Format** | glTF animations (named clips) |
| **Purpose** | Idle animations (floating, rotating, pulsing) |
| **Playback** | Looped via THREE.AnimationMixer |

### Recommended Animation Names

- `Idle` — Default looping animation
- `Hover` — Interaction feedback (optional)

### Animation Guidelines

- Keep animations subtle and professional
- Loop duration: 4–8 seconds recommended
- Use easing functions, avoid linear motion

---

## Export Checklist

Before exporting from your 3D software:

- [ ] Apply all transforms (scale = 1, rotation = 0, position = 0)
- [ ] Triangulate all meshes
- [ ] Unwrap UVs for all textured meshes
- [ ] Generate/compute normals and tangents
- [ ] Embed textures in GLB (or reference externally)
- [ ] Name the root node appropriately (e.g., `ProfileHub`, `Experience`)
- [ ] Test in [gltf.pmnd.rs](https://gltf.pmnd.rs) or THREE.js sandbox

---

## Integration Notes

Once a model is ready:

1. Place the `.glb` file in `public/models/`
2. Update `CityScene.astro` to load via GLTFLoader instead of placeholder geometry
3. Preserve the `userData.modal` property on loaded meshes for interaction
4. Maintain the `clickableObjects` array registration

---

## Reference: Current Placeholder Geometries

| Landmark | Current Geometry | Notes |
|----------|-----------------|-------|
| Profile Hub | CylinderGeometry + TorusGeometry | Central hub with halo ring |
| Experience | BoxGeometry + CylinderGeometry | Building with mast/antenna |
| Technical Skills | ConeGeometry(4) | 4-sided pyramid/spire |
| Showcase | BoxGeometry + arch BoxGeometry | Architectural portal |

These placeholders define the bounding volumes and should guide your model's overall silhouette.
