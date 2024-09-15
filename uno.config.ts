import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerAttributifyJsx,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  theme: {
    colors: {
      accent: {
        200: '#92d1fe',
        600: '#0073aa',
        900: '#003653',
        950: '#00273d',
      },
      gray: {
        100: '#f3f7f9',
        200: '#e7eff2',
        300: '#bac4c8',
        400: '#7b8f96',
        500: '#495c62',
        700: '#2a3b41',
        800: '#182a2f',
        900: '#121a1c',
      },
    },
  },
  presets: [
    presetUno({
      dark: {
        dark: '[data-theme="dark"]',
        light: '[data-theme="light"]',
      },
    }),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        romania: ['Playwrite RO:300', 'cursive'],
        argentina: ['Playwrite AR:300', 'cursive'],
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    transformerAttributifyJsx(),
  ],
  shortcuts: {
    'text-hover-ease': 'ease-out duration-200 hover:transition-all',
    'text-hover-op': 'text-hover-ease op60 group-hover:op100',
  },
});
