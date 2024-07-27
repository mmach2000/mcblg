// noinspection ES6PreferShortImport

import type { RspressPlugin } from '@rspress/shared';

import { formatISO } from 'date-fns';
import { readingTime } from 'reading-time-estimator';

import { memoizedToDate } from '../utils/memoized-to-date';
import { getGitCreated, getGitLastUpdated } from '../utils/git-info';
import type { ReadingTime, RouteToPageInfo, TagToRoutes } from '../typing';
import { CATEGORIES } from '../constants';

/**
 * Thanks to https://github.com/web-infra-dev/rspress/blob/3e28e909bf59ec3cd3800c5979161befcd0a83bb/packages/plugin-last-updated/src/index.ts
 */
export function myPluginCollectPageInfo(): RspressPlugin {
  const tagToRoutes: TagToRoutes = {};
  const routeToPageInfo: RouteToPageInfo = {};

  return {
    name: 'my-plugin/collect-page-info',
    async extendPageData(pageData) {
      const { _filepath, _relativePath, title, routePath, content, frontmatter } = pageData;

      if ((_relativePath.endsWith('tsx') && !CATEGORIES.some(s => _relativePath.includes(`${s}/`)))
        || frontmatter.notBlog) {
        return;
      }

      // collect created/updated timestamp
      const lastUpdatedInfo = await getGitLastUpdated(_filepath) ?? { lastUpdated: formatISO(new Date()), lastUpdatedHash: 'unknown' };
      const created = typeof frontmatter?.created == 'string'
        ? formatISO(memoizedToDate(frontmatter.created))
        : await getGitCreated(_filepath) ?? formatISO(new Date());

      const gitInfo = { created, ...lastUpdatedInfo };
      pageData.gitInfo = gitInfo;

      // collect read time
      const readTime: ReadingTime = frontmatter?.readTime
        ? (frontmatter.readTime as ReadingTime)
        : readingTime(content, 400, 'cn');
      readTime.text = readTime.text.replace('小于一', '1 ');
      pageData.readTime = readTime;
      routeToPageInfo[routePath] = { title, routePath, gitInfo, readTime };

      // collect tags
      const tags: string[] = frontmatter.tags as any ?? ['未分类'];
      for (const tag of tags) {
        if (!tagToRoutes[tag]) {
          tagToRoutes[tag] = [];
        }
        tagToRoutes[tag].push(routePath);
      }
    },
    async addRuntimeModules() {
      return {
        'my-virtual-page-info': `export default ${JSON.stringify(routeToPageInfo)};`,
        'my-virtual-tags': `export default ${JSON.stringify(tagToRoutes)};`,
      };
    },
  };
}
