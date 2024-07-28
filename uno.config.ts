// uno.config.ts
// noinspection JSUnusedGlobalSymbols

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  content: {
    filesystem: [
      '**/*.{html,js,ts,jsx,tsx,md,mdx,vue,svelte,astro}',
    ],
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        romania: 'Playwrite RO:300',
        argentina: 'Playwrite AR:300',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  shortcuts: {
    'text-hover-op': 'ease-out duration-200 hover:transition-all op60 group-hover:op100',
  },
});
