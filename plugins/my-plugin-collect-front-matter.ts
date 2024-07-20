import { RspressPlugin } from '@rspress/shared';

import { readingTime } from 'reading-time-estimator';

export function myPluginCollectFrontMatter(): RspressPlugin {
  const tagToRoutes: Record<string, string[]> = {};
  const routeToReadTime: Record<string, ReturnType<typeof readingTime>> = {};

  return {
    name: 'my-plugin/collect-front-matter',
    extendPageData(pageData) {
      const { routePath, content, frontmatter } = pageData;

      // collect tags
      if (frontmatter.tags) {
        for (const tag of frontmatter.tags as string[]) {
          if (!tagToRoutes[tag]) {
            tagToRoutes[tag] = [];
          }
          tagToRoutes[tag].push(routePath);
        }
      }

      // collect read time
      const readTime = frontmatter?.readTime
        ? (frontmatter.readTime as ReturnType<typeof readingTime>)
        : readingTime(content, 400, 'cn');
      pageData.readTime = readTime;
      routeToReadTime[routePath] = readTime;
    },
    addRuntimeModules() {
      return {
        'virtual-tags': `export default const tagToRoutes = ${JSON.stringify(tagToRoutes)};`,
        'virtual-read-time': `export default const routeToReadTime = ${JSON.stringify(routeToReadTime)};`,
      };
    },
  };
}
