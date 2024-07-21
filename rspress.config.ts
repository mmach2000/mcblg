import * as path from 'node:path';

import { defineConfig } from 'rspress/config';

import { myPluginCollectFrontMatter } from './plugins/my-plugin-collect-front-matter';
import { myPluginGitStatus } from './plugins/my-plugin-git-status';

export default defineConfig({
  title: '博客',
  description: '我的博客',
  root: path.join(__dirname, 'content'),

  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/mmach2000/mmach2000.github.io' },
    ],
  },
  globalStyles: path.join(__dirname, 'theme/index.css'),
  globalUIComponents: [path.join(__dirname, 'components', 'ShikiCode.tsx')],

  plugins: [
    myPluginGitStatus(),
    myPluginCollectFrontMatter(),
  ],
  mediumZoom: {
    selector: '.rspress-doc img',
  },
});
