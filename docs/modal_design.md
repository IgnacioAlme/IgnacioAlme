# Design System Document

## 1. Overview & Creative North Star

### Creative North Star: "The Terminal Architect"
This design system rejects the "flatness" of modern web design in favor of a high-fidelity, spatial digital environment. It is inspired by the precision of architectural blueprints and the immersive aesthetic of retro-futuristic data terminals. This isn't just a portfolio; it is a mission-control interface.

To achieve a "high-end editorial" feel, we move away from standard grid blocks. Instead, we utilize **intentional asymmetry**—grouping technical data in dense clusters while allowing hero imagery and typography to breathe in vast, dark "voids." We favor **overlapping elements** and **depth through transparency** to simulate a complex, multi-layered HUD (Heads-Up Display).

---

## 2. Colors

The palette is anchored in a monochromatic deep-space foundation, punctuated by high-energy luminescence.

*   **Foundation:** The core is `background` (#060E1B), a deep midnight that provides the "ink" for the screen.
*   **The Neon Pulse:** `primary` (#81ECFF) and `secondary` (#7C98FF) serve as our "light-emitting" tokens. Use these sparingly for data highlights and interactive states.
*   **The "No-Line" Rule:** Standard 1px solid dividers are strictly prohibited. Sectioning must be achieved through background shifts—placing a `surface-container-low` (#0A1421) section against the main `surface` (#060E1B)—or through "Light Leaks" (subtle 10-20% opacity gradients of `primary`).
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of glass. An inner data card should use `surface-container-highest` (#1A2638) to "float" above a `surface-container` (#101A29) parent.
*   **The Glass & Gradient Rule:** For all floating modals and navigation, apply `surface-variant` (#1A2638) at 60% opacity with a `backdrop-blur` of 12px. Main CTAs should utilize a linear gradient from `primary` (#81ECFF) to `primary-container` (#00E3FD) to simulate a glowing energy source.

---

## 3. Typography

The typography scale balances the high-tech utility of Space Grotesk with the readability of Inter.

*   **Display & Headlines (Space Grotesk):** These are our "Technical Callouts." Use `display-lg` (3.5rem) for impact, but keep tracking tight. This font conveys the "futuristic" brand identity.
*   **Body & Titles (Inter):** Inter provides the professional "sober" balance. Its neutrality ensures that long-form project descriptions remain legible against the high-contrast background.
*   **Labels (Space Grotesk):** Small caps or monospaced styling should be applied to `label-sm` to mimic terminal metadata or system timestamps.

---

## 4. Elevation & Depth

In this system, elevation is not about "real-world" shadows, but "digital luminescence."

*   **The Layering Principle:** Use the Tonal Scale. A project card sits on `surface-container-low`, and its internal tags sit on `surface-container-highest`.
*   **Ambient Shadows:** Avoid black shadows. If a component must float, use a glow effect: a 20px blur of `primary` (#81ECFF) at 5%–8% opacity. This mimics light reflecting off the surface rather than a shadow being cast.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility, use the `outline-variant` (#404857) at 20% opacity. This creates a "hairline" effect that looks like a laser-etched guide rather than a box.
*   **Scanline Textures:** Apply a repeating linear-gradient overlay (1px of `on-surface` at 2% opacity every 4px) to the highest surface layer to give it a physical screen-like texture.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#81ECFF) background with `on-primary` (#005762) text. Add a `box-shadow` glow of the same color. 0px corner radius.
*   **Secondary:** Ghost style. `outline` border at 40% opacity with `primary` text. On hover, the background fills to 10% opacity.

### Chips (Data Tags)
*   Used for tech stacks. Use `surface-container-highest` with a `primary` left-hand border (2px) to signify "active data."

### Input Fields
*   **Text Inputs:** Use `surface-container-lowest` (#000000) for the field. The label should be in `label-sm` (Space Grotesk) positioned above the field, never inside.
*   **States:** On focus, the border (Ghost Border) should pulse from 20% to 60% opacity of `primary`.

### Cards & Lists
*   **Strict Rule:** No dividers. Use `spacing-8` (1.75rem) to separate list items. 
*   **Layout:** Use asymmetrical padding—more breathing room on the left, denser data on the right—to break the "template" feel.

### Additional Component: The "Status HUD"
*   A persistent, small floating element in a corner using `label-sm` that displays "System Online" or current page coordinates, reinforcing the technical theme.

---

## 6. Do's and Don'ts

### Do
*   **DO** use 0px corner radius for everything. Sharpness conveys precision.
*   **DO** use `secondary` (#7C98FF) for "Information" and `tertiary` (#AC89FF) for "Interactions" to create a color-coded hierarchy.
*   **DO** leverage the spacing scale to create intentional "dead space," which highlights the content's importance.

### Don't
*   **DON'T** use rounded corners (`0px` is the absolute standard).
*   **DON'T** use standard grey shadows. Only use tinted glows or tonal shifts.
*   **DON'T** use 100% opaque borders. They clutter the "HUD" and break the immersion.
*   **DON'T** use "Default" font weights. Stick to Light (300) and Bold (700) to create high editorial contrast.