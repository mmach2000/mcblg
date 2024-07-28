import { useAutoAnimate } from '@formkit/auto-animate/react';
import { sort } from 'moderndash';
import { format } from 'date-fns';
import type { RuntimePageInfo } from '@/typing';
import { memoizedToDate } from '@/utils/memoized-to-date';

export function PageList({ pages }: { pages: RuntimePageInfo[] }) {
  const [parent] = useAutoAnimate();
  const sortedPages = sort(pages, { order: 'desc', by: item => item.gitInfo?.created ?? '' });
  return (
    <ul ref={parent} className="space-y-3">
      {sortedPages.map((page) => {
        const date = format(memoizedToDate(page.gitInfo.created), 'MM/dd');
        const readTime = page.readTime.text;
        return (
          <li key={page.routePath}>
            <a
              href={page.routePath}
              className="group mb-3 mt-1"
              flex="~ col md:row items-baseline gap-1 md:gap-3"
            >
              <span text="md:lg zinc-900 dark:zinc-100 hover-op">{page.title}</span>
              <span flex="~ gap-3">
                <span text="sm zinc-600 dark:zinc-400 hover-op" font="mono">{date}</span>
                <span text="sm zinc-500 dark:zinc-500 hover-op" font="mono">·</span>
                <span text="sm zinc-400 dark:zinc-600 hover-op" font="mono">{readTime}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
