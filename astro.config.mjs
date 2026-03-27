// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ignacioalme.github.io',
  base: '/IgnacioAlme/',
  vite: {
    optimizeDeps: {
      include: ['three'],
    },
  },
});
