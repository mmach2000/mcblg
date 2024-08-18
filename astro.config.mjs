import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import react from '@astrojs/react';
import UnoCSS from 'unocss/astro';
import starlight from '@astrojs/starlight';
import starlightUtils from '@lorenzo_lewis/starlight-utils';

// https://astro.build/config
export default defineConfig({
  site: 'https://mmach2000.github.io',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    ssr: {
      noExternal: [
        'tdesign-react',
      ],
    },
  },
  integrations: [
    react({ include: ['**/react/*'] }),
    UnoCSS(),
    starlight({
      title: 'Reveries',
      social: { github: 'https://github.com/withastro/starlight' },
      locales: { root: { label: '简体中文', lang: 'zh-CN' } },

      customCss: ['./src/style/global.css'],
      components: {
        Head: './src/components/astro/MyHead.astro',
        Footer: './src/components/astro/MyFooter.astro',
      },

      plugins: [starlightUtils({
        multiSidebar: {
          switcherStyle: 'hidden',
        },
        navLinks: {
          leading: {
            useSidebarLabelled: '__NavBar',
          },
        },
      })],

      sidebar: [{
        label: '__NavBar',
        items: [{
          label: 'POSTS',
          link: '/posts',
        }, {
          label: 'SERIES',
          link: '/series',
        }, {
          label: 'NOTES',
          link: '/notes',
        }],
      }, {
        label: 'Posts',
        autogenerate: {
          directory: '/posts',
        },
      }, {
        label: 'Series',
        autogenerate: {
          directory: '/series',
        },
      }, {
        label: 'Notes',
        autogenerate: {
          directory: '/notes',
        },
      }],
    }),
  ],
});
