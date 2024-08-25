import queryString from 'query-string';
import { atom, useAtom } from 'jotai';
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
import { IS_DEV, SORT_NAMES } from '@/utils/constants.ts';
import { QUERY_STRING_OPTION, locationAtom } from '@/store/jotai/location.ts';

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

const filterAtom = atom(
  (get) => {
    const rawSearchParams = get(locationAtom).searchParams;
    const searchParams = rawSearchParams && queryString.parse(rawSearchParams.toString(), QUERY_STRING_OPTION);
    const include = (searchParams?.include ? [searchParams.include].flat() : []) as string[];
    const exclude = (searchParams?.exclude ? [searchParams.exclude].flat() : []) as string[];
    return { include, exclude };
  },
  (get, set, update: { include?: string[]; exclude?: string[] }) => {
    const rawSearchParams = get(locationAtom).searchParams;
    const oldSearchParams = rawSearchParams && queryString.parse(rawSearchParams.toString(), QUERY_STRING_OPTION);
    const newSearchParams = { ...oldSearchParams, ...update };
    const searchParams = new URLSearchParams(queryString.stringify(newSearchParams, QUERY_STRING_OPTION));
    set(locationAtom, prev => ({ ...prev, searchParams }));
  },
);

const sortAtom = atom(
  (get) => {
    const rawSearchParams = get(locationAtom).searchParams;
    const searchParams = rawSearchParams && queryString.parse(rawSearchParams.toString(), QUERY_STRING_OPTION);
    const sort = (SORT_METHODS.includes(String(searchParams?.sort) as SortMethod) ? searchParams?.sort : 'ctime') as SortMethod;
    const order = (SORT_ORDERS.includes(String(searchParams?.order) as SortOrder) ? searchParams?.order : 'desc') as SortOrder;
    return { sort, order };
  },
  (get, set, update: { sort?: SortMethod; order?: SortOrder }) => {
    const rawSearchParams = get(locationAtom).searchParams;
    const oldSearchParams = rawSearchParams && queryString.parse(rawSearchParams.toString(), QUERY_STRING_OPTION);
    const newSearchParams = { ...oldSearchParams, ...update };
    const searchParams = new URLSearchParams(queryString.stringify(newSearchParams, QUERY_STRING_OPTION));
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
    <div flex="~ gap-2 wrap 1" ref={parent}>
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
          onClick={() => setFilter({ include: [], exclude: [] })}
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
  const [sortOption, setSortOption] = useAtom(sortAtom);

  const options = SORT_METHODS.flatMap((key: SortMethod, idx, arr) => {
    return [
      { content: `${SORT_NAMES[key]}${SORT_NAMES.asc}`, value: { sort: key, order: 'asc' } },
      { content: `${SORT_NAMES[key]}${SORT_NAMES.desc}`, value: { sort: key, order: 'desc' }, divider: idx !== arr.length - 1 },
    ];
  });

  return (
    <Dropdown options={options} onClick={data => setSortOption(data.value as { sort: SortMethod; order: SortOrder })}>
      <Button variant="outline" size="small">
        <span flex="~ items-center">
          {SORT_NAMES[sortOption.sort]}
          {SORT_NAMES[sortOption.order]}
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
  const [filter, setFilter] = useAtom(filterAtom);
  const [sort] = useAtom(sortAtom);

  const filteredPosts = posts.filter((post) => {
    const isInclude = filter.include.every(tag => post.tags?.includes(tag));
    const isExclude = filter.exclude.some(tag => post.tags?.includes(tag));
    return isInclude && !isExclude;
  });

  const sortedPosts = filteredPosts.sort(COMPARE_FNS[sort.sort]);
  if (sort.order === 'asc') {
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
                onClick={() => setFilter({ include: [], exclude: [] })}
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

export function PostsPage({ tags, posts }: { tags: string[]; posts: Post[] }) {
  if (IS_DEV) {
    console.log('posts:', posts);
  }

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
