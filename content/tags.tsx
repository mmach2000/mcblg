import { unique } from 'radash';
import { Timeline } from '@douyinfe/semi-ui';
import { useMediaQuery } from '@uidotdev/usehooks';
import { NoSSR, useSearchParams } from '@rspress/runtime';

// @ts-expect-error Virtual modules are runtime-only
import tagToInfos from 'my-virtual-tags';

import type { RuntimePageInfo } from '../types';

type TagToPageInfos = Record<string, RuntimePageInfo[]>;

export default function Tags() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  const tags = searchParams.getAll('tag');

  if (tags.length === 0) {
    return null;
  } else {
    const posts = unique(
      tags
        .flatMap(tag => (tagToInfos as TagToPageInfos)[tag] || [])
        .filter(tag => tag?.gitInfo?.created),
      post => post.routePath,
    );

    console.log(tags
      .flatMap(tag => (tagToInfos as TagToPageInfos)[tag] || []));
    console.log(posts);

    const place = isSmallDevice ? 'left' : 'center';
    return (
      <NoSSR>
        <Timeline mode={place}>
          {posts.map((post) => {
            const time = new Date(post.gitInfo.created);
            const readingTime = post.readTime.text;
            const extra = `${post.routePath} · 阅读时间 ${readingTime}`;
            return (
              <Timeline.Item time={time.toLocaleDateString()} key={post.routePath} extra={extra}>
                {post.title}
              </Timeline.Item>
            );
          })}
        </Timeline>
      </NoSSR>
    );
  }
}
