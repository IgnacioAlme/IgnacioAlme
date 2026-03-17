# 3D City Map UI — Implementation Plan

Convert the current 2D [index.astro](file:///c:/Users/vicio/Documents/Portfolio/IgnacioAlme/src/pages/index.astro) landing page into a rotatable isometric-style 3D city built with Three.js. The existing HUD (header/footer) and modal system are preserved as HTML overlays on top of the canvas.

---

## Proposed Changes

### Three.js Dependency

#### [MODIFY] [package.json](file:///c:/Users/vicio/Documents/Portfolio/IgnacioAlme/package.json)
- Add `three` and `@types/three` as dependencies.

---

### New 3D Scene Component

#### [NEW] [CityScene.astro](file:///c:/Users/vicio/Documents/Portfolio/IgnacioAlme/src/components/CityScene.astro)

A self-contained Astro component that mounts a full-viewport Three.js canvas. All 3D logic lives in its `<script>` block (client-side only). Responsibilities:

- **Scene setup**: `WebGLRenderer`, `PerspectiveCamera` at ~60° tilt (isometric feel), `OrbitControls` (mouse/touch drag to rotate, scroll to zoom, clamped angles so the city stays visible).
- **Lighting**: Ambient light (soft blue-white) + two `DirectionalLight`s to create depth and a slight "GT" neon rim effect.
- **Ground plane**: `PlaneGeometry` with a dark material and a `GridHelper` overlaid to echo the existing grid CSS motif.
- **Decoration buildings** (procedural): ~30–50 random `BoxGeometry` towers seeded across the grid. Varying heights/widths, all using the GT dark palette. Do not respond to clicks.
- **Landmark buildings** (4): Distinct geometry clusters that conceptually map to the existing nav-nodes. Clickable via raycasting.
- **Label sprites**: `THREE.Sprite` text labels above each landmark (white text, GT blue border).
- **Raycasting**: On `pointerdown`, cast a ray against landmark meshes; fire the existing modal-open logic when a hit is detected.
- **Animation loop**: Subtle camera orbit idle animation (very slow auto-rotation), disabled while user is dragging.
- **Post-processing** (optional, stretch goal): `UnrealBloomPass` for glow on landmark tops.

---

### Landmark Building Specs (Placeholder Models)

All 4 landmarks use procedural `THREE.BufferGeometry` (no external model files needed for the placeholder phase). Each is a composition of primitive shapes. Below is the specification so that a 3D artist can replace them later.

| Node | Visual Concept | Placeholder Geometry | Target Dimensions (w×d×h) | Interaction |
|---|---|---|---|---|
| **Profile Hub** | Lighthouse / tower with circular ring | Cylinder + Torus (halo ring) | 1×1×5 units | Click → opens Profile modal |
| **Experience** | Industrial complex / antenna tower | Box + thin Cylinder mast | 2×2×4 units | Click → opens Experience modal |
| **Technical Skills** | Pyramid / crystal spire (mirrors existing triangle icon) | `ConeGeometry` (4-sided) | 1.5×1.5×4 units | Click → opens Skills modal |
| **Showcase** | Vault / locked chest building (mirrors existing padlock icon) | Box (body) + Box (shackle arch) | 2×2×3 units | Click → opens Showcase modal |

#### Model Requirements for Future Artist Assets (GLB/GLTF format)
When placeholder geometry is replaced by real models, they must meet:
- **Format**: `.glb` (binary glTF 2.0) — loaded via `THREE.GLTFLoader`.
- **Scale**: Designed at 1 unit = 1 meter. Fit within the bounding boxes above.
- **Origin**: Pivot point at the base center of the model.
- **Materials**: PBR (`MeshStandardMaterial`-compatible) — `baseColorTexture`, `roughnessMetallicTexture`, optional `emissiveTexture` for glow areas.
- **Texture resolution**: Max 1024×1024 px (portfolio site must stay lightweight).
- **Poly count**: ≤ 3,000 triangles per landmark model.
- **Naming**: `profile-hub.glb`, `experience.glb`, `skills.glb`, `showcase.glb` — placed in `public/models/`.
- **Vertex colors**: Optional GT-blue emissive highlights baked into vertex colors for the neon effect.
- **Animation**: Optional idle animation (e.g. slow halo spin) using a `THREE.AnimationMixer` clip named `idle`.

---

### Updated Landing Page

#### [MODIFY] [index.astro](file:///c:/Users/vicio/Documents/Portfolio/IgnacioAlme/src/pages/index.astro)

- Import and embed `<CityScene />` as the full-viewport background element.
- Remove the 2D `map-container`, `.nav-node`, `.center-grid` divs (replaced by the 3D canvas).
- Retain all CSS for HUD panels (`header`, `footer`, `.gt-panel`, `.modal-*`) as an overlay (`z-index` above canvas).
- Retain all modal HTML and the existing `<script>` modal JS (raycasting calls into the same `openModal(id)` helper).
- Extract a shared `openModal(id: string)` function so both the old script block and the new Three.js raycaster can trigger modals.

---

### Model Spec Document

#### [NEW] [3d-city-models.md](file:///c:/Users/vicio/Documents/Portfolio/IgnacioAlme/docs/3d-city-models.md)
A standalone reference for artists/contributors documenting all model requirements (mirrors the table + list above).

---

### Playwright Tests

#### [MODIFY] [landing.spec.ts](file:///c:/Users/vicio/Documents/Portfolio/IgnacioAlme/tests/landing.spec.ts)
The DOM structure changes significantly — `.nav-node`, `.center-grid`, `.map-overlay` etc. are removed. Tests must be updated:

| Existing Test | Action |
|---|---|
| `navigation nodes are present` | Rewrite to check for label text in a `data-label` attribute on the Three.js canvas wrapper or hidden `<div>` sentinel elements that the 3D script creates |
| `profile hub shows detail panel on click` | Simulate click using `page.locator('#city-canvas').click()` at the known pixel position of the Profile Hub landmark (or add a hidden trigger element) |
| `background elements are present` | Update to check for `#city-canvas` instead of `.map-background` / `.map-overlay` etc. |
| `central grids are animated` | Remove (no longer exists as HTML) |
| All modal tests | Keep as-is — modal HTML/JS is unchanged |
| HUD tests (header, footer, date) | Keep as-is — HUD HTML is unchanged |

> [!IMPORTANT]
> Playwright cannot click inside a WebGL canvas at a semantic level. To keep E2E tests meaningful, the implementation will insert **hidden `<button>` sentinel elements** (visually off-screen, `opacity: 0; pointer-events: none`) with `data-modal="profile"` etc., which the Three.js raycaster programmatically `.click()`s. Playwright tests can then target these buttons.

---

## Verification Plan

### Automated Tests

```bash
# 1. Type-check all Astro/TS files
npx astro check

# 2. Run E2E Playwright suite
npm run test
```

All tests must report **0 failures**.

### Manual Verification

After `npm run dev` (http://localhost:4321):

1. **3D scene loads** — a dark city grid with buildings is visible on the landing page.
2. **Camera rotation** — click and drag on the canvas; the city should rotate smoothly.
3. **Scroll zoom** — scroll the mouse wheel; the camera zooms in/out.
4. **Landmark click → modal** — click on each of the 4 landmark buildings; the correct modal (About Me / Work History / Technical Skills / Showcase) should open.
5. **Modal close** — close via ×, overlay click, or Escape key.
6. **HUD** — header (Credits, Date, user name) and footer (Mission Status, buttons) still visible.
7. **Dark theme** — background stays dark, GT blue accents visible on buildings and labels.
