// noinspection ES6PreferShortImport

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
import { CC_ICONS } from './src/utils/constants.ts';

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
    presetIcons({
      collections: {
        'cc-icons': async (iconName) => {
          // technically not a CC-license...
          if (iconName === 'fu') {
            return `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 197 197" width="1em" height="1em">
                <path
                  fill="currentColor"
                  d="M98 .5a98 98 0 0 0-98 98 98 98 0 0 0 98 98 98 98 0 0 0 98-98 98 98 0 0 0-98-98m0 20a78 78 0 0 1 78 78 78 78 0 0 1-78 78 78 78 0 0 1-78-78 78 78 0 0 1 78-78M50.334 50.998v63.541C50.34 140.87 71.669 162.196 98 162.207c26.33-.011 47.656-21.334 47.666-47.664h.002V51h-25.004v63.54c-.023 12.513-10.152 22.645-22.666 22.665-12.514-.02-22.644-10.152-22.666-22.666v-4.04h35.416V85.497H75.332V75.5h35.416V50.998z" />
              </svg>
            `;
          } else if (iconName === 'un') {
            return `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 196 196" width="1em" height="1em">
                <path
                  fill="currentColor"
                  d="M98 0A98 98 0 0 0 0 98a98 98 0 0 0 98 98 98 98 0 0 0 98-98A98 98 0 0 0 98 0m0 20a78 78 0 0 1 45.408 14.592L34.613 143.387A78 78 0 0 1 20 98a78 78 0 0 1 78-78m0 23a55 55 0 0 0-55 55 55 55 0 0 0 6.8 26.2l19.118-19.118A30 30 0 0 1 68 98a30 30 0 0 1 30-30 30 30 0 0 1 7.137.863l19.16-19.16A55 55 0 0 0 98 43m63.133 9.223A78 78 0 0 1 176 98a78 78 0 0 1-78 78 78 78 0 0 1-45.787-14.86zm-14.895 19.379L132.84 85h18.558a55 55 0 0 0-5.16-13.398M125.44 110A30 30 0 0 1 98 128a30 30 0 0 1-7.215-.945l-19.088 19.088A55 55 0 0 0 98 153a55 55 0 0 0 53.531-43z" />
              </svg>
            `;
          }

          const resp = await fetch(`https://mirrors.creativecommons.org/presskit/icons/${iconName}.svg`);
          const svg = await resp.text();
          return svg
            .replace(/width=".+?px"/, 'width="1em"')
            .replace(/height=".+?px"/, 'height="1em"')
            .replace(/#FFFFFF/g, '#FFFFFF00')
            .replace(/<path /g, '<path fill="currentColor" ');
        },
      },
    }),
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
    'license-link': 'text-accent-900 decoration-none',
  },
  safelist: [
    ...Object.values(CC_ICONS),
  ],
});
