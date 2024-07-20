import { RspressPlugin } from '@rspress/shared';

export function myPluginCollectTags(): RspressPlugin {
  return {
    name: 'my-plugin/collect-tags',
    extendPageData(pageData) {
    },
  };
}
