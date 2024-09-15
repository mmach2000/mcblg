import react from '@astrojs/react';
import UnoCSS from 'unocss/astro';
import partytown from '@astrojs/partytown';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { defineConfig } from 'astro/config';
import { base64Import } from 'vite-plugin-base64-import';

// https://astro.build/config
export default defineConfig({
  site: 'https://mcblg.pages.dev',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  vite: {
    build: { sourcemap: true },
    ssr: { noExternal: ['tdesign-react', 'react-tweet', '@douyinfe/semi-illustrations'] },
    optimizeDeps: { exclude: ['@resvg/resvg-js'] },
    plugins: [base64Import()],
  },
  experimental: {
    clientPrerender: true,
  },
  integrations: [
    react({ include: ['**/react/*'] }),
    UnoCSS(),
    starlight({
      title: 'mc\'s blog',
      favicon: 'img/logo-square.svg',
      locales: { root: { label: '简体中文', lang: 'zh-CN' } },
      social: {
        github: 'https://github.com/mmach2000/mcblg',
      },

      customCss: ['./src/style/global.css'],
      components: {
        Head: './src/components/astro/MyHead.astro',
        Footer: './src/components/astro/MyFooter.astro',
        Sidebar: './src/components/astro/MySidebar.astro',
        PageTitle: './src/components/astro/MyPageTitle.astro',
        SiteTitle: './src/components/astro/MySiteTitle.astro',
      },

      sidebar: [
        { label: 'Posts', autogenerate: { directory: '/posts' }, collapsed: true },
        { label: 'Series', autogenerate: { directory: '/series' }, collapsed: true },
        { label: 'Notes', autogenerate: { directory: '/notes' }, collapsed: true },
      ],
    }),
    partytown({ config: { forward: ['dataLayer.push'] } }),
  ],
});
