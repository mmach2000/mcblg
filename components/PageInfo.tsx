import { usePageData } from '@rspress/runtime';
import { format } from 'date-fns';
import type { GitInfo, HydratedGitInfo } from '@/typing';
import { hydrateGitInfo } from '@/utils/hydrate-git-info';
import { GITHUB_LINK } from '@/constants';

const DATE_FORMAT = 'yyyy/MM/dd';

const Sep = () => <span>/</span>;

export function PageInfo() {
  const { page } = usePageData();
  if (!page.injected) {
    return null;
  }

  const gitInfo: HydratedGitInfo = hydrateGitInfo(page.gitInfo as GitInfo);
  const wordCount = page.wordCount as number;
  const commitUrl = `${GITHUB_LINK}/commit/${gitInfo.lastUpdatedHash}`;

  return (
    <div flex="~ wrap gap-2" text="sm zinc-400 dark:zinc-500" font="mono" mb="5">
      <span>
        {`Created: ${format(gitInfo.created, DATE_FORMAT)}`}
      </span>
      <Sep />
      <span>
        {`Updated: ${format(gitInfo.lastUpdated, DATE_FORMAT)}`}
      </span>
      <Sep />
      <span>
        <a href={commitUrl} className="decoration-underline decoration-dashed" target="_blank" rel="noopener noreferrer">
          {gitInfo.lastUpdatedHash}
        </a>
      </span>
      <Sep />
      <span>
        {`${wordCount} words`}
      </span>
    </div>
  );
}
