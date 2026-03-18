# AGENTS.md - Agent Coding Guidelines

This document provides guidelines for AI agents working on this codebase.

## Project Overview

| Property | Value |
|----------|-------|
| **Type** | Astro-based portfolio website |
| **Framework** | Astro v6 |
| **Language** | TypeScript (strict mode) |
| **3D Engine** | Three.js |
| **Testing** | Playwright |
| **Node** | >=22.12.0 |

---

## Build & Development Commands

```bash
# Development
npm run dev              # Start dev server (hot reload)
npm run build            # Production build
npm run preview          # Preview production build

# Astro CLI
npm run astro <command>  # Run any Astro command

# Testing (Playwright)
npm run test             # Run all tests
npm run test:ui          # Run tests with UI mode
npx playwright test                                    # All tests
npx playwright test tests/landing.spec.ts              # Single file
npx playwright test -g "profile hub"                   # Single test by name
npx playwright test --reporter=list                    # Verbose output
```

**Important**: Playwright automatically starts `npm run dev` before running tests locally.

---

## Agent Workflow Requirements

When working on this project, agents **MUST** follow these steps:

1. **Explain Actions** — State what you're doing and why before making changes
2. **Verify** — Run `npx astro check` to verify no TypeScript/Astro errors
3. **Test** — Run `npm run test` to ensure E2E tests pass
4. **Fix Errors** — Correct any reported errors before marking the task complete

---

## Code Style Guidelines

### TypeScript

- Uses `astro/tsconfigs/strict` — ALL strict rules enabled
- **Never use `any`** — Use `unknown` when type is truly unknown
- Enable strict mode in your editor
- Use explicit type annotations for function parameters and return types

### Astro Components (.astro files)

```
// File structure order:
1. --- frontmatter (imports, props, logic)
2. Template HTML
3. <style> block (at bottom)
```

- **Imports**: Sort alphabetically within groups
- **Indentation**: 2 spaces for HTML/JSX
- **Props**: Use TypeScript interfaces for component props
- **Scripts**: Use `is:global` for styles that need to leak to children

### CSS/Styling

- Use **scoped styles** within `<style>` blocks
- Prefer **CSS custom properties** for theme values
- Modern CSS features: flexbox, grid, `clamp()`, `calc()`
- Mobile-first responsive design
- Class naming: **kebab-case** (e.g., `.modal-overlay`)

### File Organization

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable Astro components
├── layouts/         # Page layouts
└── pages/           # Route-based page components
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CityScene.astro`, `Layout.astro` |
| Regular files | kebab-case | `my-component.astro` |
| CSS classes | kebab-case | `.user-panel`, `.modal-content` |
| Variables | camelCase | `isLoading`, `buildingConfig` |
| Constants | SCREAMING_SNAKE | `MAX_BUILDINGS`, `GT_BLUE` |
| Types/Interfaces | PascalCase | `BuildingConfig`, `ModalData` |

### Imports

- Use relative imports for local files
- Sort imports alphabetically: `import A from 'a'; import B from 'b';`
- Third-party imports first, then local imports
- Group by: external → internal → relative

---

## Error Handling

- Let Astro handle errors with built-in error pages
- For client-side code: wrap async operations in try/catch
- Use `console.error()` for recoverable errors, `throw` for fatal ones
- Validate DOM elements exist before use:

```typescript
const element = document.getElementById('my-id');
if (!element) {
  console.error('Required element #my-id not found');
  throw new Error('Canvas not found');
}
```

---

## Three.js Specific Guidelines

When working with `CityScene.astro`:

- **Scene setup**: Create renderer, camera, lights, ground plane, grid
- **Building groups**: Use `THREE.Group` to parent related meshes
- **Raycasting**: Add clickable objects to `clickableObjects` array
- **Modal integration**: Set `group.userData.modal = 'modal-id'`
- **Labels**: Use `THREE.Sprite` with canvas textures
- **Colors**: Define in CONFIG section at top of file (see below)
- **Ambient animation**: Use `requestAnimationFrame` loop with delta time
- **Post-processing**: Use `EffectComposer` + `UnrealBloomPass` for bloom effects

---

## Gran Turismo-Style 3D City Map

The landing page features a rotatable 3D city map built with Three.js, styled after Gran Turismo's neon cyberpunk aesthetic.

### CONFIG Constants

All 3D parameters are defined in a `CONFIG` object at the top of `CityScene.astro`:

```typescript
const CONFIG = {
  // Camera
  CAMERA_MIN_DIST: 5,      // Closest zoom (stay near buildings)
  CAMERA_MAX_DIST: 18,      // Farthest zoom
  CAMERA_INITIAL: { x: 0, y: 8, z: 12 },

  // Lighting
  SUN_COLOR: 0xfff8e0,      // Warm sunlight
  SUN_INTENSITY: 1.8,       // Strong directional light
  AMBIENT_INTENSITY: 0.25,  // Low ambient (dramatic contrast)

  // Atmosphere
  FOG_DENSITY: 0.015,      // Light atmospheric fog (FogExp2)

  // Bloom (UnrealBloomPass)
  BLOOM_THRESHOLD: 0.2,
  BLOOM_STRENGTH: 0.8,
  BLOOM_RADIUS: 0.5,

  // Colors
  GT_BLUE: 0x25aff4,        // Signature neon blue
  GT_DARK: 0x0a0c10,        // Background color

  // Buildings
  DECORATION_COUNT: 40,
  MAP_SIZE: 40,
  CENTER_CLEAR_RADIUS: 5
};
```

### Visual Guidelines

| Element | Implementation |
|---------|----------------|
| **Lighting** | Sun DirectionalLight at low angle (40, 60, 20), rim light for neon edge glow |
| **Buildings** | Colored accent bands at base + emissive accents on decorations |
| **Ground** | Glowing road lines (cross roads + diagonals), reflective material |
| **Grid** | Bright blue lines (opacity 0.6), subtle overlay |
| **Fog** | FogExp2 with scene background color for horizon fade |
| **Post-processing** | UnrealBloomPass for neon glow, ACES filmic tone mapping |

### Post-Processing Setup

```typescript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  CONFIG.BLOOM_STRENGTH,
  CONFIG.BLOOM_RADIUS,
  CONFIG.BLOOM_THRESHOLD
);
composer.addPass(bloomPass);
```

### Landmark Buildings

| Landmark | Geometry | Dimensions | Modal | Accent Color |
|----------|----------|------------|-------|--------------|
| Profile Hub | Cylinder + Torus halo | 1×1×5 | `profile` | Blue (#25aff4) |
| Experience | Box + Cylinder mast | 2×2×4 | `experience` | Green (#22c55e) |
| Technical Skills | 4-sided ConeGeometry | 1.5×1.5×4 | `skills` | Red (#ef4444) |
| Showcase | Box body + arch | 2×2×3 | `showcase` | Yellow (#eab308) |

---

## VS Code Extensions

Recommended (see `.vscode/extensions.json`):

- Astro
- TypeScript and JavaScript Language Features

---

## Testing Guidelines

### Writing Tests (`tests/landing.spec.ts`)

- Use Playwright's `test` and `expect` imports
- Target elements with `data-modal` attributes when available
- Use `page.evaluate()` to call `window.openModal()` directly
- Test modal open/close: overlay click, X button, Escape key
- Test HUD elements: header, footer, date update

### Single Test Execution

```bash
# By file
npx playwright test tests/landing.spec.ts

# By test name (partial match)
npx playwright test -g "profile"

# By line number (add test in file)
npx playwright test tests/landing.spec.ts:30
```

---

## Best Practices Checklist

- [ ] Run `npx astro check` after every change
- [ ] Run `npm run test` before marking tasks complete
- [ ] Use TypeScript interfaces for all component props
- [ ] Keep components single-purpose
- [ ] Minimize client-side JavaScript; prefer static HTML/CSS
- [ ] Use semantic HTML elements
- [ ] Validate DOM elements before use
- [ ] Comment complex Three.js logic
