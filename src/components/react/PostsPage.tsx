import { CheckTag } from 'tdesign-react';
import { computed } from 'nanostores';
import { useStore } from '@nanostores/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { withLeadingSlash } from 'ufo';

import { $urlQueryStore, setQuery } from '@/store/url-query-store.ts';
import { IS_DEV } from '@/utils/env.ts';

interface Post {
  slug: string;
  title: string;
  tags?: string[];
  words: number;
}

interface QueryStore {
  include?: string[] | string;
  exclude?: string[] | string;
}

const $tagFilter = computed($urlQueryStore, (queryStore: QueryStore) => {
  const include = queryStore.include ? [queryStore.include].flat() : [];
  const exclude = queryStore.exclude ? [queryStore.exclude].flat() : [];
  return { include, exclude };
});

function CheckTagsCloud({ tags }: { tags: string[] }) {
  const tagFilter = useStore($tagFilter);

  function propsFactory(tag: string) {
    if (tagFilter.include.includes(tag)) {
      return {
        theme: 'success' as const,
        icon: <span i-lucide:filter mr-2 />,
        onClick: () => {
          // include -> exclude
          setQuery({
            include: tagFilter.include.filter(t => t !== tag),
            exclude: [tag, ...tagFilter.exclude],
          });
        },
      };
    } else if (tagFilter.exclude.includes(tag)) {
      return {
        theme: 'danger' as const,
        icon: <span i-lucide:filter-x mr-2 />,
        onClick: () => {
          // exclude -> default
          setQuery({ exclude: tagFilter.exclude.filter(t => t !== tag) });
        },
      };
    } else {
      return {
        theme: 'default' as const,
        icon: <span i-lucide:tag mr-2 />,
        onClick: () => {
          // default -> include
          setQuery({ include: [tag, ...tagFilter.include] });
        },
      };
    }
  }

  return (
    <div flex="~ gap-2 wrap" mb-3 mt--7 md="mt-0 mb-5">
      {
        tags.map((tag) => {
          return (
            <CheckTag
              key={tag}
              {...propsFactory(tag)}
            >
              {/* TODO: fix the evil -2px */}
              <span font-mono mb="[-2px]">
                {tag}
              </span>
            </CheckTag>
          )
          ;
        })
      }
    </div>
  );
}

function FilteredPosts({ posts }: { posts: Post[] }) {
  const [parent] = useAutoAnimate();
  const tagFilter = useStore($tagFilter);

  const filteredPosts = posts.filter((post) => {
    const include = tagFilter.include.every(tag => post.tags?.includes(tag));
    const exclude = tagFilter.exclude.some(tag => post.tags?.includes(tag));
    return include && !exclude;
  });

  return (
    <ol ref={parent} list-none p-0>
      {filteredPosts.map((post) => {
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

export function PostsPage({ tags, posts }: { tags: string[]; posts: Post[] }) {
  if (IS_DEV) {
    console.log('posts:', posts);
  }

  return (
    <div className="not-content" mx-auto max-w-5xl>
      <CheckTagsCloud tags={tags} />
      <FilteredPosts posts={posts} />
    </div>
  );
}
