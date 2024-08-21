import queryString from 'query-string';
import { atom, useAtom } from 'jotai';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { withLeadingSlash } from 'ufo';
import { Button, CheckTag, Link } from 'tdesign-react';
import { IllustrationNoResult, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';

import { Empty } from '@/components/react/Empty.tsx';
import { IS_DEV } from '@/utils/env.ts';
import { SERIALIZATION_OPTION, locationAtom } from '@/store/jotai/location.ts';

interface Post {
  slug: string;
  title: string;
  tags?: string[];
  words: number;
}

const filterAtom = atom(
  (get) => {
    const rawSearchParams = get(locationAtom).searchParams;
    const searchParams = rawSearchParams && queryString.parse(rawSearchParams.toString(), SERIALIZATION_OPTION);
    const include = (searchParams?.include ? [searchParams.include].flat() : []) as string[];
    const exclude = (searchParams?.exclude ? [searchParams.exclude].flat() : []) as string[];
    return { include, exclude };
  },
  (_get, set, update: { include?: string[]; exclude?: string[] }) => {
    const searchParams = new URLSearchParams(queryString.stringify(update, SERIALIZATION_OPTION));
    set(locationAtom, prev => ({ ...prev, searchParams }));
  },
);

function TagsCloud({ tags }: { tags: string[] }) {
  const [parent] = useAutoAnimate();
  const [filter, setFilter] = useAtom(filterAtom);

  function propsFactory(tag: string) {
    if (filter.include.includes(tag)) {
      return {
        theme: 'success' as const,
        icon: <span i-lucide:filter mr-2 />,
        onClick: () => {
          // include -> exclude
          setFilter({
            include: filter.include.filter(t => t !== tag),
            exclude: [tag, ...filter.exclude],
          });
        },
      };
    } else if (filter.exclude.includes(tag)) {
      return {
        theme: 'danger' as const,
        icon: <span i-lucide:filter-x mr-2 />,
        onClick: () => {
          // exclude -> default
          setFilter({
            include: filter.include,
            exclude: filter.exclude.filter(t => t !== tag),
          });
        },
      };
    } else {
      return {
        theme: 'default' as const,
        icon: <span i-lucide:tag mr-2 />,
        onClick: () => {
          // default -> include
          setFilter({
            include: [tag, ...filter.include],
            exclude: filter.exclude,
          });
        },
      };
    }
  }

  return (
    <div flex="~ gap-2 wrap" mb-3 mt--1 md="mt-0 mb-5" ref={parent}>
      { tags.map(tag => (
        <CheckTag key={tag} {...propsFactory(tag)}>
          <span font-mono mb="[-2px]">
            {tag}
          </span>
        </CheckTag>
      )) }
      {(filter.include.length > 0 || filter.exclude.length > 0) && (
        <Button
          size="small"
          theme="default"
          variant="outline"
          onClick={() => setFilter({})}
          icon={<span i-lucide:refresh-ccw mr-2 />}
        >
          <span font-mono mb="[-2px]">
            重置筛选
          </span>
        </Button>
      )}
    </div>
  );
}

function Posts({ posts }: { posts: Post[] }) {
  const [parent] = useAutoAnimate();
  return (
    <ol ref={parent} list-none p-0>
      {posts.map((post) => {
        const wordCount = `${post.words} words`;
        return (
          <li key={post.slug}>
            <a
              href={withLeadingSlash(post.slug)}
              className="group mb-3 mt-1 decoration-none"
              flex="~ col md:row items-baseline gap-1 md:gap-3"
            >
              <span text="md:lg gray-900 dark:gray-100 hover-op">{post.title}</span>
              <span flex="~ gap-1">
                <span text="sm gray-700 dark:gray-200 hover-op" font="mono">{wordCount}</span>
                <span text="sm gray-600 dark:gray-200 hover-op" font="mono">·</span>
                <span text="sm gray-500 dark:gray-300 hover-op" font="mono">{post.tags?.join(', ')}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function FilteredPosts({ posts }: { posts: Post[] }) {
  const [parent] = useAutoAnimate();
  const [filter, setFilter] = useAtom(filterAtom);

  const filteredPosts = posts.filter((post) => {
    const isInclude = filter.include.every(tag => post.tags?.includes(tag));
    const isExclude = filter.exclude.some(tag => post.tags?.includes(tag));
    return isInclude && !isExclude;
  });

  return (
    <div ref={parent}>
      {filteredPosts.length
        ? <Posts posts={filteredPosts} />
        : (
            <Empty
              title="暂未找到匹配的筛选结果"
              description={(
                <span>
                  试试
                  {' '}
                  {/* eslint-disable-next-line react/prefer-shorthand-boolean */}
                  <Link onClick={() => setFilter({})} theme="primary" size="large" underline={true}>
                    重置筛选条件
                  </Link>
                </span>
              )}
              image={IllustrationNoResult}
              palette={['#e7eff2', '#0073aa']}
              darkModeImage={IllustrationNoResultDark}
              className="mt-8"
            />
          )}
    </div>
  );
}

export function PostsPage({ tags, posts }: { tags: string[]; posts: Post[] }) {
  if (IS_DEV) {
    console.log('posts:', posts);
  }

  return (
    <div className="not-content" mx-auto max-w-5xl>
      <TagsCloud tags={tags} />
      <FilteredPosts posts={posts} />
    </div>
  );
}
