import { filterPosts, NoPosts, PostItem, TagsPanel } from '@/components/react/pages/PostsPage.tsx';

import { excludeAtom, includeAtom } from '@/store/jotai/catalog-page.ts';
import { SERIES_NAMES } from '@/utils/constants.ts';
import { getSeries, type PostMetadata } from '@/utils/content.ts';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useAtomValue } from 'jotai/index';
import { isEmpty } from 'moderndash';

function SeriesCard({ name, posts }: { name: string; posts: PostMetadata[] }) {
  const [parent] = useAutoAnimate();

  return (
    <div flex="~ col gap-3" border="~ solid gray-300 dark:gray-700" break-inside-avoid p="x-4 y-[13px]" mb-4>
      <h2 text="[24px]">
        {SERIES_NAMES[name] ?? name}
      </h2>
      <ol ref={parent} list-none p-0>
        {posts.map(post => (<PostItem key={post.slug} post={post} />))}
      </ol>
    </div>
  );
}

function SeriesPanel({ series }: { series: Partial<Record<string, PostMetadata[]>> }) {
  const [panel] = useAutoAnimate();
  const [cards] = useAutoAnimate();
  const include = useAtomValue(includeAtom);
  const exclude = useAtomValue(excludeAtom);

  const filteredSeries = Object.entries(series).map(([name, posts]) => {
    if (!posts) {
      return undefined;
    }

    const filteredPosts = filterPosts(posts, include, exclude);
    return filteredPosts.length > 0 ? [name, filteredPosts] : undefined;
  }).filter(Boolean) as [string, PostMetadata[]][];

  return (
    <div ref={panel} mt-4>
      { isEmpty(filteredSeries)
        ? <NoPosts really={isEmpty(series)} />
        : (
            <div ref={cards} className="md:columns-2">
              {filteredSeries.map(([name, posts]) => (
                <SeriesCard key={name} name={name} posts={posts} />
              ))}
            </div>
          )}
    </div>
  );
}

export function SeriesPage({ tags, posts }: { tags: string[]; posts: PostMetadata[] }) {
  const series = Object.groupBy(posts, post => getSeries(post.slug) ?? '');

  return (
    <div className="not-content" mx-auto max-w-5xl>
      <div flex="~ gap-3" mb-3 mt--1 md="mt-0 mb-5">
        {tags.length > 0 && <TagsPanel tags={tags} />}
      </div>
      <SeriesPanel series={series} />
    </div>
  );
}
