# AGENTS.md - Agent Coding Guidelines

This document provides guidelines for AI agents working on this codebase.

## Project Overview

- **Project Type**: Astro-based portfolio website
- **Framework**: Astro v6
- **Language**: TypeScript (strict mode)
- **Node Version**: >=22.12.0

## Build & Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI
npm run astro <command>

# Run E2E tests (Playwright)
npm run test
npm run test:ui
```

**Note**: This project uses Playwright for End-to-End testing. Playwright will automatically start the dev server (`npm run dev`) before running tests locally.

## Agent Workflow Requirements

When working on this project, agents MUST follow these operational steps:
1. **Explain Actions**: Clearly explain the actions you are taking or planning to take before and during execution.
2. **Post-Task Verification**: When you finish your work, you MUST run `npx astro check` to verify there are no TypeScript or Astro errors. You MUST also run `npm run test` to ensure E2E tests pass.
3. **Error Correction**: If tests or `astro check` report any errors, you MUST correct them before considering the task complete.

## Code Style Guidelines

### General Principles

- Keep code simple and readable
- Use Astro's built-in features when possible
- Minimize client-side JavaScript; prefer static HTML/CSS
- Use semantic HTML elements

### TypeScript

- Uses `astro/tsconfigs/strict` - all TypeScript rules are enabled
- Enable strict type checking in your editor
- Avoid `any` type; use proper types or `unknown` when necessary

### Astro Components (.astro files)

- Frontmatter (---) goes at the top of the file
- Import statements in frontmatter, sorted alphabetically
- Template HTML comes after frontmatter
- `<style>` block at the bottom of the file
- Use 2-space indentation for HTML/JSX
- Use Astro's built-in `.src` property for imported assets

### CSS/Styling

- Use scoped styles within `<style>` blocks
- Prefer CSS custom properties for theme values
- Use modern CSS features (flexbox, grid, clamp, etc.)
- Mobile-first responsive design approach

### File Organization

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable Astro components
├── layouts/         # Page layouts
└── pages/           # Route-based page components
```

### Naming Conventions

- **Components**: PascalCase (e.g., `Welcome.astro`, `Layout.astro`)
- **Files**: kebab-case (e.g., `my-component.astro`)
- **CSS classes**: kebab-case or BEM-style

### Imports

- Use relative imports for local files
- Sort imports alphabetically within groups

### Error Handling

- Let Astro handle errors with its built-in error pages
- For client-side code, use proper error boundaries

### Best Practices

1. Use `<Image />` component from Astro for optimized images when available
2. Leverage Astro's partial hydration for interactive components
3. Keep components focused and single-purpose
4. Use TypeScript interfaces for component props
5. Use descriptive variable and function names

## VS Code Extensions

Recommended extensions (see `.vscode/extensions.json`):
- Astro
- TypeScript and JavaScript Language Features
