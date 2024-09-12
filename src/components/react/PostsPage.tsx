import { useAtom, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { withLeadingSlash } from 'ufo';
import { Button, CheckTag, Dropdown, Link } from 'tdesign-react';
import {
  IllustrationIdle,
  IllustrationIdleDark,
  IllustrationNoResult,
  IllustrationNoResultDark,
} from '@douyinfe/semi-illustrations';

import { format } from 'date-fns';
import { Empty } from '@/components/react/Empty.tsx';
import { SORT_NAMES } from '@/utils/constants.ts';
import { createQueryAtom, getFromSearch } from '@/store/jotai/location.ts';

interface Post {
  slug: string;
  title: string;
  tags?: string[];
  words: number;
  ctime: Date;
  mtime: Date;
}

const SORT_METHODS = ['ctime', 'mtime', 'words'] as const;
const SORT_ORDERS = ['asc', 'desc'] as const;

type SortMethod = typeof SORT_METHODS[number];
type SortOrder = typeof SORT_ORDERS[number];

const COMPARE_FNS: Record<SortMethod, (a: Post, b: Post) => number> = {
  ctime: (a, b) => b.ctime.getTime() - a.ctime.getTime(),
  mtime: (a, b) => b.mtime.getTime() - a.mtime.getTime(),
  words: (a, b) => b.words - a.words,
};

const includeAtom = createQueryAtom<string[]>('include', []);
const excludeAtom = createQueryAtom<string[]>('exclude', []);
const sortAtom = createQueryAtom<[SortMethod]>('sort', ['ctime']);
const orderAtom = createQueryAtom<[SortOrder]>('order', ['desc']);

function TagsCloud({ tags }: { tags: string[] }) {
  const [parent] = useAutoAnimate();
  const [include, setInclude] = useAtom(includeAtom);
  const [exclude, setExclude] = useAtom(excludeAtom);

  function propsFactory(tag: string) {
    if (include.includes(tag)) {
      return {
        theme: 'success' as const,
        icon: <span i-lucide:filter mr-2 />,
        onClick: () => {
          // include -> exclude
          setInclude(include.filter(t => t !== tag));
          setExclude([tag, ...exclude]);
        },
      };
    } else if (exclude.includes(tag)) {
      return {
        theme: 'danger' as const,
        icon: <span i-lucide:filter-x mr-2 />,
        onClick: () => {
          // exclude -> default
          setExclude(exclude.filter(t => t !== tag));
        },
      };
    } else {
      return {
        theme: 'default' as const,
        icon: <span i-lucide:tag mr-2 />,
        onClick: () => {
          // default -> include
          setInclude([tag, ...include]);
        },
      };
    }
  }

  return (
    <div flex="~ gap-2 wrap 1" ref={parent}>
      { tags.map(tag => (
        <CheckTag key={tag} {...propsFactory(tag)}>
          <span font-mono mb="[-2px]">
            {tag}
          </span>
        </CheckTag>
      )) }
      {(include.length > 0 || exclude.length > 0) && (
        <Button
          size="small"
          theme="default"
          variant="outline"
          onClick={() => {
            setInclude([]);
            setExclude([]);
          }}
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

function SortPanel() {
  // const [sortOption, setSortOption] = useAtom(sortAtom);
  const [[sort], setSort] = useAtom(sortAtom);
  const [[order], setOrder] = useAtom(orderAtom);

  const options = SORT_METHODS.flatMap(key =>
    SORT_ORDERS.map(order => ({
      content: `${SORT_NAMES[key]}${SORT_NAMES[order]}`,
      value: { sort: key, order },
      divider: true,
    })));
  options.at(-1)!.divider = false;

  return (
    <Dropdown
      options={options}
      onClick={(data) => {
        const value = data.value as { sort: SortMethod; order: SortOrder };
        setSort([value.sort]);
        setOrder([value.order]);
      }}
    >
      <Button variant="outline" size="small">
        <span flex="~ items-center">
          {SORT_NAMES[sort]}
          {SORT_NAMES[order]}
          <span i-lucide:chevron-down ml-1 />
        </span>
      </Button>
    </Dropdown>
  );
}

function Posts({ posts }: { posts: Post[] }) {
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

function FilteredPosts({ posts }: { posts: Post[] }) {
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

export function PostsPage({ tags, posts, initialUrl }: { tags: string[]; posts: Post[]; initialUrl?: string }) {
  const search = initialUrl ? new URL(initialUrl).search : undefined;

  const initialInclude = getFromSearch<string[]>('include', [], search);
  const initialExclude = getFromSearch<string[]>('exclude', [], search);
  const initialSort = getFromSearch<[SortMethod]>('sort', ['ctime'], search);
  const initialOrder = getFromSearch<[SortOrder]>('order', ['desc'], search);

  useHydrateAtoms([
    [includeAtom, initialInclude],
    [excludeAtom, initialExclude],
    [sortAtom, initialSort],
    [orderAtom, initialOrder],
  ]);

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
