import * as path from 'node:path';

import { defineConfig } from 'rspress/config';

import { myPluginCollectTags } from './plugins/my-plugin-collect-tags';
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

  globalStyles: path.join(__dirname, 'theme/index.css'),
  themeConfig: {
    socialLinks: [
      { icon: 'github', mode: 'link', content: 'https://github.com/web-infra-dev/rspress' },
    ],
  },

  plugins: [
    myPluginGitStatus(),
    myPluginCollectTags(),
  ],
  mediumZoom: {
    selector: '.rspress-doc img',
  },
});
