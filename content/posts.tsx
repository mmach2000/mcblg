import { useSearchParams } from '@rspress/runtime';
import { Space, Tag } from '@douyinfe/semi-ui';

// @ts-expect-error Virtual modules are runtime-only
import tagToInfos from 'my-virtual-tags';

import type { RuntimePageInfo } from '../types';

type TagToPageInfos = Record<string, RuntimePageInfo[]>;

export function TagsCloud() {
  const [searchParams, setSearchParams] = useSearchParams();
  const includeTags = new Set(searchParams.getAll('i'));
  const excludeTags = new Set(searchParams.getAll('e'));

  function getColor(tag: string) {
    if (includeTags.has(tag)) {
      return 'green';
    } else if (excludeTags.has(tag)) {
      return 'red';
    }
  }

  function getOnClick(tag: string) {
    return () => {
      if (includeTags.has(tag)) {
        includeTags.delete(tag);
        excludeTags.add(tag);
      } else if (excludeTags.has(tag)) {
        excludeTags.delete(tag);
      } else {
        includeTags.add(tag);
      }

      setSearchParams({
        i: Array.from(includeTags),
        e: Array.from(excludeTags),
      });
    };
  }

  return (
    <Space>
      {Object.keys(tagToInfos).map(tag => (
        <Tag onClick={getOnClick(tag)} color={getColor(tag)} key={tag}>
          {tag}
        </Tag>
      ))}
    </Space>
  );
}

export default function Archive() {
  return <TagsCloud />;
}

export const frontmatter = {
  pageType: 'custom',
};
