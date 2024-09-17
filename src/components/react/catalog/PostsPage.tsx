import type { PostMetadata } from '@/utils/content.ts';
import { Empty } from '@/components/react/catalog/Empty.tsx';
import { SortPanel } from '@/components/react/catalog/SortPanel.tsx';
import { TagsCloud } from '@/components/react/catalog/TagsCloud.tsx';

import { excludeAtom, includeAtom, orderAtom, sortAtom, type SortMethod } from '@/store/jotai/catalog-page.ts';
import {
  IllustrationIdle,
  IllustrationIdleDark,
  IllustrationNoResult,
  IllustrationNoResultDark,
} from '@douyinfe/semi-illustrations';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { format } from 'date-fns';
import { useAtom, useAtomValue } from 'jotai';
import { Link } from 'tdesign-react';
import { withLeadingSlash } from 'ufo';

const COMPARE_FNS: Record<SortMethod, (a: PostMetadata, b: PostMetadata) => number> = {
  ctime: (a, b) => b.ctime.getTime() - a.ctime.getTime(),
  mtime: (a, b) => b.mtime.getTime() - a.mtime.getTime(),
  words: (a, b) => b.words - a.words,
};

function Posts({ posts }: { posts: PostMetadata[] }) {
  const [parent] = useAutoAnimate();
  return (
    <ol ref={parent} list-none p-0>
      {posts.map((post) => {
        const wordCount = `${post.words} words`;
        const createTime = format(post.ctime, 'yyyy/MM/dd');
        return (
          <li key={post.slug}>
            <a
              href={withLeadingSlash(post.slug)}
              className="group mb-3 mt-1 decoration-none"
              flex="~ col md:row items-baseline gap-1 md:gap-3"
            >
              <span text="md:lg gray-900 dark:gray-100 hover-op">{post.title}</span>
              <span flex="~ gap-1">
                <span text="sm gray-700 dark:gray-200 hover-op" font-mono>{createTime}</span>
                <span text="sm gray-600 dark:gray-200 hover-op" font-mono>·</span>
                <span text="sm gray-500 dark:gray-300 hover-op" font-mono>{wordCount}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function FilteredPosts({ posts }: { posts: PostMetadata[] }) {
  const [parent] = useAutoAnimate();
  const [include, setInclude] = useAtom(includeAtom);
  const [exclude, setExclude] = useAtom(excludeAtom);
  const [sort] = useAtomValue(sortAtom);
  const [order] = useAtomValue(orderAtom);

  const filteredPosts = posts.filter((post) => {
    const isInclude = include.every(tag => post.tags?.includes(tag));
    const isExclude = exclude.some(tag => post.tags?.includes(tag));
    return isInclude && !isExclude;
  });

  const sortedPosts = filteredPosts.sort(COMPARE_FNS[sort]);
  if (order === 'asc') {
    sortedPosts.reverse();
  }

  const empty = posts.length
    ? (
        <Empty
          title="暂未找到匹配的筛选结果"
          description={(
            <span>
              试试
              {' '}
              <Link
                underline
                size="large"
                theme="primary"
                onClick={() => {
                  setInclude([]);
                  setExclude([]);
                }}
              >
                重置筛选条件
              </Link>
            </span>
          )}
          image={IllustrationNoResult}
          palette={['#e7eff2', '#0073aa']}
          darkModeImage={IllustrationNoResultDark}
          className="mt-8"
        />
      )
    : (
        <Empty
          title="博主太懒了，一篇也没有写！"
          image={IllustrationIdle}
          palette={['#e7eff2', '#0073aa']}
          darkModeImage={IllustrationIdleDark}
          className="mt-8"
        />
      );

  return (
    <div ref={parent}>
      {sortedPosts.length ? <Posts posts={sortedPosts} /> : empty}
    </div>
  );
}

export function PostsPage({ tags, posts }: { tags: string[]; posts: PostMetadata[] }) {
  return (
    <div className="not-content" mx-auto max-w-5xl>
      <div flex="~ gap-3" mb-3 mt--1 md="mt-0 mb-5">
        {tags.length > 0 && <TagsCloud tags={tags} />}
        <SortPanel />
      </div>
      <FilteredPosts posts={posts} />
    </div>
  );
}
