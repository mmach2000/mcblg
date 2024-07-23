import * as path from 'node:path';

import { defineConfig } from 'rspress/config';

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

  globalStyles: path.join(__dirname, 'theme/index.css'),
  globalUIComponents: [path.join(__dirname, 'components', 'SideEffects.tsx')],

  builderConfig: {
    output: {
      polyfill: 'usage',
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/mmach2000/mmach2000.github.io' },
    ],
  },

  plugins: [
    myPluginCollectPageInfo(),
  ],
  mediumZoom: {
    selector: '.rspress-doc img',
  },
});
