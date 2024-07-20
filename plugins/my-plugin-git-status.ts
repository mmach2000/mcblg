import type { RspressPlugin } from '@rspress/shared';
import { execa } from 'execa';

async function getGitCreated(filePath: string) {
  try {
    // Thanks to https://stackoverflow.com/a/25633731
    return (await execa('git', [
      'log',
      '--diff-filter=A',
      '--follow',
      '--format=%h %at',
      '-1',
      filePath,
    ])).stdout;
  }
  catch {
    return null;
  }
}

async function getGitLastUpdated(filePath: string) {
  try {
    return (await execa('git', [
      'log',
      '--format=%h %at',
      '-1',
      filePath,
    ])).stdout;
  }
  catch {
    return null;
  }
}

function parseInfo(info: string) {
  if (!info) {
    return null;
  }
  const [hash, timestamp] = info.split(' ');
  const time = new Date(Number(timestamp) * 1000);
  return { hash, time };
}

/**
 * Plugin to add created/updated timestamp & hash to page data.
 * Thanks to https://github.com/web-infra-dev/rspress/blob/3e28e909bf59ec3cd3800c5979161befcd0a83bb/packages/plugin-last-updated/src/index.ts
 */
export function myPluginGitStatus(): RspressPlugin {
  return {
    name: 'my-plugin/git-status',
    async extendPageData(pageData) {
      const { _filepath } = pageData;
      const [lastUpdated, created] = await Promise.all([
        getGitLastUpdated(_filepath),
        getGitCreated(_filepath),
      ]);
      pageData.lastUpdated = parseInfo(lastUpdated);
      pageData.created = pageData.created || parseInfo(created);
      console.log(pageData);
    },
  };
}
