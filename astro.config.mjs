import partytown from '@astrojs/partytown';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import UnoCSS from 'unocss/astro';
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
        Head: './src/components/astro/replace/MyHead.astro',
        Footer: './src/components/astro/replace/MyFooter.astro',
        Sidebar: './src/components/astro/replace/MySidebar.astro',
        PageTitle: './src/components/astro/replace/MyPageTitle.astro',
        SiteTitle: './src/components/astro/replace/MySiteTitle.astro',
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
