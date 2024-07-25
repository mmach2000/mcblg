// noinspection ES6PreferShortImport

import type { RspressPlugin } from '@rspress/shared';

import { formatISO } from 'date-fns';
import { readingTime } from 'reading-time-estimator';

import type { ReadingTime, RouteToPageInfo, TagToRoutes } from '../typing';
import { getGitCreated, getGitLastUpdated } from '../utils/git-info';

/**
 * Thanks to https://github.com/web-infra-dev/rspress/blob/3e28e909bf59ec3cd3800c5979161befcd0a83bb/packages/plugin-last-updated/src/index.ts
 */
export function myPluginCollectPageInfo(): RspressPlugin {
  const tagToRoutes: TagToRoutes = {};
  const routeToPageInfo: RouteToPageInfo = {};

  return {
    name: 'my-plugin/collect-page-info',
    async extendPageData(pageData, isProd) {
      const { _filepath, title, routePath, content, frontmatter } = pageData;

      // collect created/updated timestamp
      const lastUpdatedInfo = await getGitLastUpdated(_filepath);
      const created = typeof frontmatter?.created == 'string'
        ? formatISO(new Date(frontmatter.created))
        : await getGitCreated(_filepath);

      const gitInfo = !created || !lastUpdatedInfo
        ? undefined
        : { created, ...lastUpdatedInfo };
      pageData.gitInfo = gitInfo;

      // collect read time
      const readTime: ReadingTime = frontmatter?.readTime
        ? (frontmatter.readTime as ReadingTime)
        : readingTime(content, 400, 'cn');
      readTime.text = readTime.text.replace('小于一', '1 ');
      pageData.readTime = readTime;
      routeToPageInfo[routePath] = { title, routePath, gitInfo, readTime };

      // collect tags
      if (frontmatter.tags) {
        for (const tag of frontmatter.tags as string[]) {
          if (!tagToRoutes[tag]) {
            tagToRoutes[tag] = [];
          }
          tagToRoutes[tag].push(routePath);
        }
      }

      !isProd && console.log('my-plugin/git-status', pageData);
    },
    async addRuntimeModules() {
      return {
        'my-virtual-page-info': `export default ${JSON.stringify(routeToPageInfo)};`,
        'my-virtual-tags': `export default ${JSON.stringify(tagToRoutes)};`,
      };
    },
  };
}
