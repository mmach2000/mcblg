import { format } from 'date-fns';
import { Fragment } from 'react';
import { usePageData } from '@rspress/runtime';

import { GITHUB_LINK } from '@/constants';
import { hydrateGitInfo } from '@/utils/hydrate-git-info';
import type { GitInfo, HydratedGitInfo } from '@/typing';

const DATE_FORMAT = 'yyyy/MM/dd';

const Sep = () => <span>/</span>;

export function PageInfo() {
  const { page } = usePageData();

  if (!page.injected) {
    return null;
  }

  const gitInfo: HydratedGitInfo = hydrateGitInfo(page.gitInfo as GitInfo);
  const commitUrl = `${GITHUB_LINK}/commit/${gitInfo.lastUpdatedHash}`;
  const wordCount = page.wordCount as number;
  const tags = (page.frontmatter.tags as string[] | undefined)?.filter(tag => tag !== '未分类');

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
      {tags?.length > 0 && (
        <>
          <Sep />
          <span>
            {tags.map((tag, idx) => {
              const tagUrl = `/posts.html?filter=${tag}`;
              return (
                <Fragment key={tag}>
                  <a href={tagUrl} className="decoration-underline decoration-dashed">
                    {`#${tag}`}
                  </a>
                  {idx + 1 !== tags.length && ', '}
                </Fragment>
              );
            })}
          </span>
        </>
      )}
    </div>
  );
}
