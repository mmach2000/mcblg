import type { GitInfo, HydratedGitInfo } from '@/typing';
import { memoizedToDate } from '@/utils/memoized-to-date';

export function hydrateGitInfo(gitInfo: GitInfo): HydratedGitInfo {
  return {
    ...gitInfo,
    created: memoizedToDate(gitInfo.created),
    lastUpdated: memoizedToDate(gitInfo.lastUpdated),
  };
}
