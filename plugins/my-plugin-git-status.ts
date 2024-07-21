import type { RspressPlugin } from '@rspress/shared';
import { execa } from 'execa';

interface GitInfo {
  created?: Date;
  lastUpdated?: Date;
  lastUpdatedHash?: string;
}

async function getGitCreated(filePath: string): Promise<Date | undefined> {
  try {
    // Thanks to https://stackoverflow.com/a/25633731
    const cmd = await execa('git', [
      'log',
      '--diff-filter=A',
      '--follow',
      '--format=%at',
      '-1',
      filePath,
    ]);
    if (!cmd.stdout) {
      return undefined;
    }
    return new Date(Number(cmd.stdout) * 1000);
  } catch {
    return undefined;
  }
}

async function getGitLastUpdated(filePath: string): Promise<{ lastUpdatedHash: string; lastUpdated: Date } | undefined> {
  try {
    const cmd = await execa('git', [
      'log',
      '--format=%h %at',
      '-1',
      filePath,
    ]);
    if (!cmd.stdout) {
      return undefined;
    }
    const [lastUpdatedHash, timestamp] = cmd.stdout.split(' ');
    const lastUpdated = new Date(Number(timestamp) * 1000);
    return { lastUpdatedHash, lastUpdated };
  } catch {
    return undefined;
  }
}

/**
 * Plugin to add created/updated timestamp & hash to page data.
 * Thanks to https://github.com/web-infra-dev/rspress/blob/3e28e909bf59ec3cd3800c5979161befcd0a83bb/packages/plugin-last-updated/src/index.ts
 */
export function myPluginGitStatus(): RspressPlugin {
  const routeToGitInfo: Record<string, GitInfo> = {};

  return {
    name: 'my-plugin/git-status',
    async extendPageData(pageData) {
      const { _filepath, routePath, frontmatter } = pageData;

      const lastUpdatedInfo = await getGitLastUpdated(_filepath);
      const created = typeof frontmatter?.created == 'string'
        ? new Date(frontmatter.created)
        : await getGitCreated(_filepath);

      if (!created || !lastUpdatedInfo) {
        return;
      }

      const gitInfo = { created, ...lastUpdatedInfo };
      pageData.gitInfo = gitInfo;
      routeToGitInfo[routePath] = gitInfo;

      // !isProd && console.log('my-plugin/git-status', pageData);
    },
    addRuntimeModules() {
      return { 'virtual-git-status': `export default ${JSON.stringify(routeToGitInfo)};` };
    },
  };
}
