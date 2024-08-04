import { memoizedToDate } from '@/utils/memoized-to-date';
import type { GitInfo, HydratedGitInfo } from '@/typing';

export function hydrateGitInfo(gitInfo: GitInfo): HydratedGitInfo {
  return {
    ...gitInfo,
    created: memoizedToDate(gitInfo.created),
    lastUpdated: memoizedToDate(gitInfo.lastUpdated),
  };
}
