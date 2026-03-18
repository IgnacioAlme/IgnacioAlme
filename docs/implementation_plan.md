# 3D City Map UI — Implementation Plan

Convert the current 2D `index.astro` landing page into a rotatable isometric-style 3D city built with Three.js. The existing HUD (header/footer) and modal system are preserved as HTML overlays on top of the canvas.

---

## Section 1 — Dependencies `[ ]`

- [ ] Install `three` and `@types/three`:
  ```bash
  npm install three
  npm install -D @types/three
  ```
- [ ] Confirm `package.json` reflects both packages under `dependencies` and `devDependencies`.

---

## Section 2 — Three.js Scene Setup `[ ]`

**File**: [NEW] `src/components/CityScene.astro`

- [ ] Create the component file with a full-viewport `<canvas id="city-canvas">`.
- [ ] Initialize `WebGLRenderer` (antialias, alpha, device pixel ratio).
- [ ] Set up `PerspectiveCamera` at ~60° tilt for an isometric feel.
- [ ] Add `OrbitControls`: enable mouse/touch drag to rotate, scroll to zoom; clamp vertical angle so the city never goes below ground.
- [ ] Add lighting:
  - Ambient light (soft blue-white).
  - Two `DirectionalLight`s for depth and GT neon rim effect.
- [ ] Build ground plane (`PlaneGeometry`) with dark material + `GridHelper` overlay.
- [ ] Add resize listener to keep canvas responsive.
- [ ] Start the `requestAnimationFrame` render loop with slow idle auto-rotation (paused while dragging).

---

## Section 3 — Decoration Buildings `[ ]`

**File**: `src/components/CityScene.astro`

- [ ] Generate ~30–50 random `BoxGeometry` towers spread across the grid.
- [ ] Randomize height, width, and depth within defined ranges.
- [ ] Apply GT dark palette materials (dark grey base, subtle GT-blue emissive on top faces).
- [ ] Ensure decoration meshes are excluded from the raycast target group (clicks pass through them).

---

## Section 4 — Landmark Buildings (Placeholder Geometry) `[ ]`

**File**: `src/components/CityScene.astro`

| Landmark | Geometry | Dimensions (w×d×h) | Modal |
|---|---|---|---|
| Profile Hub | Cylinder + Torus halo | 1×1×5 | `profile` |
| Experience | Box + Cylinder mast | 2×2×4 | `experience` |
| Technical Skills | 4-sided ConeGeometry | 1.5×1.5×4 | `skills` |
| Showcase | Box body + Box arch | 2×2×3 | `showcase` |

- [ ] Build **Profile Hub** landmark group.
- [ ] Build **Experience** landmark group.
- [ ] Build **Technical Skills** landmark group.
- [ ] Build **Showcase** landmark group.
- [ ] Add all 4 landmark meshes to a shared `clickableObjects` array for raycasting.
- [ ] Add floating `THREE.Sprite` text labels above each landmark.

#### Future Artist Model Requirements (GLB/GLTF)
When replacing placeholders with real models, each `.glb` file must:
- Use **binary glTF 2.0** format and be loaded via `THREE.GLTFLoader`.
- Fit within the bounding boxes above (1 unit = 1 meter, pivot at base center).
- Use **PBR materials** (`MeshStandardMaterial`-compatible): `baseColorTexture`, `roughnessMetallicTexture`, optional `emissiveTexture`.
- Stay within **≤ 3,000 triangles** and **≤ 1024×1024 px** textures.
- Be named `profile-hub.glb`, `experience.glb`, `skills.glb`, `showcase.glb` and placed in `public/models/`.
- Optionally include a looping `idle` clip for `THREE.AnimationMixer`.

---

## Section 5 — Interaction (Raycasting & Modals) `[ ]`

**Files**: `src/components/CityScene.astro`, `src/pages/index.astro`

- [ ] Add `pointerdown` listener on the canvas; cast a ray against `clickableObjects`.
- [ ] On hit, read the `userData.modal` property of the intersected mesh and call `openModal(id)`.
- [ ] Extract `openModal(id: string)` as a shared helper (exposed on `window`) so both the Three.js script and any HTML can call it.
- [ ] Insert 4 **hidden sentinel `<button>` elements** (off-screen, `opacity: 0; pointer-events: none`) with `data-modal="profile|experience|skills|showcase"` — the raycaster programmatically `.click()`s them so Playwright can target them.

---

## Section 6 — Landing Page Update `[ ]`

**File**: [MODIFY] `src/pages/index.astro`

- [ ] Import and render `<CityScene />` as the full-viewport background.
- [ ] Remove 2D elements: `.map-container`, `.nav-node` divs, `.center-grid`, `.map-background`, `.map-overlay`, `.map-lines`, `.scanline`.
- [ ] Remove CSS rules for the removed elements.
- [ ] Keep all HUD CSS (`header`, `footer`, `.gt-panel`, `.panel`, `.label`, `.value`, etc.) and position the HUD overlay above the canvas (`z-index` stack).
- [ ] Keep all modal HTML (`#modalOverlay`, `#modalContent`, `#modalBody`, `#modalClose`).
- [ ] Keep all modal JS logic; wire it to use the shared `openModal` helper.

---

## Section 7 — Playwright Tests Update `[ ]`

**File**: [MODIFY] `tests/landing.spec.ts`

- [ ] Update `navigation nodes are present` — target sentinel buttons instead of `.nav-node`.
- [ ] Update `profile hub shows detail panel on click` — click sentinel button `[data-modal="profile"]`.
- [ ] Update `experience modal shows on click` — click sentinel button `[data-modal="experience"]`.
- [ ] Update `technical skills modal shows on click` — click sentinel button `[data-modal="skills"]`.
- [ ] Update `background elements are present` — check for `#city-canvas` instead of `.map-background` / `.map-overlay` etc.
- [ ] Remove `central grids are animated` test (element no longer exists).
- [ ] Keep all other modal tests unchanged (HTML/JS is unchanged).
- [ ] Keep all HUD tests unchanged (header, footer, date).

---

## Section 8 — Verification `[ ]`

- [ ] Run `npx astro check` → **0 errors, 0 warnings**.
- [ ] Run `npm run test` → **all tests pass**.
- [ ] Manual check — `npm run dev` at `http://localhost:4321`:
  - [ ] 3D scene loads with dark city and buildings visible.
  - [ ] Camera rotates on drag; zooms on scroll.
  - [ ] Clicking each landmark opens the correct modal.
  - [ ] Modals close via ×, overlay click, and Escape.
  - [ ] HUD (header, footer, date) remains visible.
  - [ ] Dark GT theme with blue accents is intact.

---

## Section 9 — Model Spec Doc `[ ]`

- [ ] Create `docs/3d-city-models.md` as a standalone artist reference documenting model format, scale, poly/texture limits, file naming, and animation conventions.
