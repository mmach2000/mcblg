import type { PostMetadata } from '@/utils/content.ts';
import { Empty } from '@/components/react/Empty.tsx';

import { excludeAtom, includeAtom, orderAtom, SORT_METHODS, SORT_NAMES, SORT_ORDERS, sortAtom, type SortMethod, type SortOrder } from '@/store/jotai/catalog-page.ts';
import { IllustrationIdle, IllustrationIdleDark, IllustrationNoResult, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { format } from 'date-fns';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { isEmpty } from 'moderndash';
import { Button, CheckTag, Dropdown, Link } from 'tdesign-react';
import { withLeadingSlash } from 'ufo';

const COMPARE_FNS: Record<SortMethod, (a: PostMetadata, b: PostMetadata) => number> = {
  ctime: (a, b) => b.ctime.getTime() - a.ctime.getTime(),
  mtime: (a, b) => b.mtime.getTime() - a.mtime.getTime(),
  words: (a, b) => b.words - a.words,
};

export function PostItem({ post }: { post: PostMetadata }) {
  const wordCount = `${post.words} words`;
  const createTime = format(post.ctime, 'yyyy/MM/dd');
  return (
    <li>
      <a
        href={withLeadingSlash(post.slug)}
        className="group mb-3 mt-1 decoration-none"
        flex="~ col sm:row items-baseline gap-1 sm:gap-3"
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
}

export function NoPosts({ really }: { really: boolean }) {
  const setInclude = useSetAtom(includeAtom);
  const setExclude = useSetAtom(excludeAtom);

  const resetFilters = () => {
    setInclude([]);
    setExclude([]);
  };

  return really
    ? (
        <Empty
          key="nothing"
          className="mt-8"
          image={IllustrationIdle}
          palette={['#e7eff2', '#0073aa']}
          darkModeImage={IllustrationIdleDark}
          title="博主太懒了，一篇也没有写！"
        />
      )
    : (
        <Empty
          key="no-result"
          className="mt-8"
          image={IllustrationNoResult}
          palette={['#e7eff2', '#0073aa']}
          darkModeImage={IllustrationNoResultDark}
          title="暂未找到匹配的筛选结果"
          description={(
            <span>
              试试
              {' '}
              <Link underline size="large" theme="primary" onClick={resetFilters}>
                重置筛选条件
              </Link>
            </span>
          )}
        />
      );
}

export function filterPosts(posts: PostMetadata[], include: string[], exclude: string[]) {
  return posts.filter((post) => {
    const isInclude = include.every(tag => post.tags?.includes(tag));
    const isExclude = exclude.some(tag => post.tags?.includes(tag));
    return isInclude && !isExclude;
  });
}

function PostsPanel({ posts }: { posts: PostMetadata[] }) {
  const [panel] = useAutoAnimate();
  const [list] = useAutoAnimate();
  const include = useAtomValue(includeAtom);
  const exclude = useAtomValue(excludeAtom);
  const [sort] = useAtomValue(sortAtom);
  const [order] = useAtomValue(orderAtom);

  const displayPosts = filterPosts(posts, include, exclude).sort(COMPARE_FNS[sort]);
  if (order === 'asc') {
    displayPosts.reverse();
  }
  return (
    <div ref={panel}>
      {isEmpty(displayPosts)
        ? <NoPosts really={isEmpty(posts)} />
        : (
            <ol ref={list} list-none p-0>
              {displayPosts.map(post => <PostItem key={post.slug} post={post} />)}
            </ol>
          )}
    </div>
  );
}

export function TagsPanel({ tags }: { tags: string[] }) {
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
      {tags.map(tag => (
        <CheckTag key={tag} {...propsFactory(tag)}>
          <span font-mono mb="[-2px]">
            {tag}
          </span>
        </CheckTag>
      ))}
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

export function SortPanel() {
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

export function PostsPage({ tags, posts }: { tags: string[]; posts: PostMetadata[] }) {
  return (
    <div className="not-content" mx-auto max-w-5xl>
      <div flex="~ gap-3" mb-3 mt--1 md="mt-0 mb-5">
        {tags.length > 0 && <TagsPanel tags={tags} />}
        <SortPanel />
      </div>
      <PostsPanel posts={posts} />
    </div>
  );
}
