import * as path from 'node:path';

import { defineConfig } from 'rspress/config';

import remarkMath from 'remark-math';
import rehypeShiki from '@shikijs/rehype';
import pluginGoogleAnalytics from 'rspress-plugin-google-analytics';

import rehypeKatex from 'rehype-katex';
import { myPluginCollectPageInfo } from './plugins/my-plugin-collect-page-info';

export default defineConfig({
  title: '博客',
  description: '我的博客',
  root: path.join(__dirname, 'content'),

  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },

  globalStyles: path.join(__dirname, 'index.css'),
  globalUIComponents: [path.join(__dirname, 'components/SideEffects.tsx')],

  builderConfig: {
    output: {
      polyfill: 'usage',
      sourceMap: { js: 'source-map', css: true },
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/mmach2000/mmach2000.github.io' },
    ],
  },

  plugins: [
    pluginGoogleAnalytics({ id: 'G-02B72QHDVW' }),
    myPluginCollectPageInfo(),
  ],
  mediumZoom: {
    selector: '.rspress-doc img',
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      // @ts-ignore
      rehypeKatex,
      // @ts-ignore
      [rehypeShiki, { themes: { light: 'github-light', dark: 'github-dark' } }],
    ],
    mdxRs: {
      include: (filepath: string) => !filepath.includes('.plus.md'),
    },
  },
});
