// noinspection ES6PreferShortImport

import type { PageIndexInfo, RspressPlugin } from '@rspress/shared';

import { formatISO } from 'date-fns';

import { memoizedToDate } from '../utils/memoized-to-date';
import { getGitCreated, getGitLastUpdated } from '../utils/git-info';
import type { RouteToPageInfo, TagToRoutes } from '../typing';
import { PATHS } from '../constants';

async function collectGitInfo({ frontmatter, _filepath }: PageIndexInfo) {
  const lastUpdatedInfo = await getGitLastUpdated(_filepath) ?? { lastUpdated: formatISO(new Date()), lastUpdatedHash: 'unknown' };
  const created = typeof frontmatter?.created == 'string'
    ? formatISO(memoizedToDate(frontmatter.created))
    : await getGitCreated(_filepath) ?? formatISO(new Date());

  return { created, ...lastUpdatedInfo };
}

/**
 * Thanks to https://github.com/web-infra-dev/rspress/blob/3e28e909bf59ec3cd3800c5979161befcd0a83bb/packages/plugin-last-updated/src/index.ts
 */
export function myPluginCollectPageInfo(): RspressPlugin {
  const routes = Object.fromEntries(PATHS.map(p => [p, []])) as Record<(typeof PATHS)[number], string[]>;
  const tagToRoutes = Object.fromEntries(PATHS.map(p => [p, {}])) as Record<(typeof PATHS)[number], TagToRoutes>;
  const routeToPageInfo = Object.fromEntries(PATHS.map(p => [p, {}])) as Record<(typeof PATHS)[number], RouteToPageInfo>;

  return {
    name: 'my-plugin/collect-page-info',
    async extendPageData(pageData) {
      const { routePath, _relativePath, frontmatter, title } = pageData;

      if (!PATHS.some(s => _relativePath.startsWith(`${s}/`)) || frontmatter.notBlog) {
        return;
      }

      // mark as injected
      pageData.injected = true;

      const category = _relativePath.split('/')[0] as (typeof PATHS)[number];
      pageData.category = category;

      // collect created/updated timestamp
      const gitInfo = await collectGitInfo(pageData);
      pageData.gitInfo = gitInfo;

      // collect word count
      const wordCount = frontmatter.wordCount as number ?? 0;
      pageData.wordCount = wordCount;

      // collect routes
      routes[category].push(routePath);

      // collect tags
      const tags: string[] = frontmatter.tags as any ?? ['未分类'];
      for (const tag of tags) {
        if (!tagToRoutes[category][tag]) {
          tagToRoutes[category][tag] = [];
        }
        tagToRoutes[category][tag].push(routePath);
      }

      // collect page info
      routeToPageInfo[category][routePath] = { title, routePath, gitInfo, wordCount };
    },
    async addRuntimeModules() {
      return Object.fromEntries(PATHS.flatMap(p => [
        [`my-virtual-${p}-routes`, `export default ${JSON.stringify(routes[p])};`],
        [`my-virtual-${p}-tags`, `export default ${JSON.stringify(tagToRoutes[p])};`],
        [`my-virtual-${p}-page-info`, `export default ${JSON.stringify(routeToPageInfo[p])};`],
      ]));
    },
  };
}
