import type { RspressPlugin } from '@rspress/shared';

import { readingTime } from 'reading-time-estimator';
import { formatISO } from 'date-fns';
import { getGitCreated, getGitLastUpdated } from '../utils/git-info';

import type { RuntimePageInfo } from '../types';

/**
 * Thanks to https://github.com/web-infra-dev/rspress/blob/3e28e909bf59ec3cd3800c5979161befcd0a83bb/packages/plugin-last-updated/src/index.ts
 */
export function myPluginCollectPageInfo(): RspressPlugin {
  const tagToPageInfos: Record<string, RuntimePageInfo[]> = {};
  const routeToPageInfo: Record<string, RuntimePageInfo> = {};

  return {
    name: 'my-plugin/collect-page-info',
    async extendPageData(pageData) {
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
      const readTime = frontmatter?.readTime
        ? (frontmatter.readTime as ReturnType<typeof readingTime>)
        : readingTime(content, 400, 'cn');
      pageData.readTime = readTime;
      routeToPageInfo[routePath] = { title, routePath, gitInfo, readTime };

      // collect tags
      if (frontmatter.tags) {
        for (const tag of frontmatter.tags as string[]) {
          if (!tagToPageInfos[tag]) {
            tagToPageInfos[tag] = [];
          }
          tagToPageInfos[tag].push(routeToPageInfo[routePath]);
        }
      }

      // !isProd && console.log('my-plugin/git-status', pageData);
    },
    async addRuntimeModules() {
      return {
        'my-virtual-page-info': `export default ${JSON.stringify(routeToPageInfo)};`,
        'my-virtual-tags': `export default ${JSON.stringify(tagToPageInfos)};`,
      };
    },
  };
}
