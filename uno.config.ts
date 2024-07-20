// uno.config.ts
import { defineConfig, presetUno, transformerDirectives } from 'unocss';

export default defineConfig({
  content: {
    filesystem: [
      '**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}',
    ],
  },
  presets: [
    presetUno(),
  ],
  transformers: [
    transformerDirectives(),
  ],
});
