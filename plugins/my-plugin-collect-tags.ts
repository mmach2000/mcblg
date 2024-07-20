import { RspressPlugin } from '@rspress/shared';

export function myPluginCollectTags(): RspressPlugin {
  const tagToRoutes = new Map<string, string[]>();

  return {
    name: 'my-plugin/collect-tags',
    extendPageData(pageData) {
      const { routePath, frontmatter: { tags } } = pageData;
      if (tags) {
        for (const tag of tags as string[]) {
          if (!tagToRoutes.has(tag)) {
            tagToRoutes.set(tag, []);
          }
          tagToRoutes.get(tag)!.push(routePath);
        }
      }
    },
    async addRuntimeModules() {
      return { 'virtual-tag-status': `export default const tagToRoutes = ${JSON.stringify(tagToRoutes)};` };
    },
  };
}
