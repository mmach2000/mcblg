import { Space, Tag } from '@douyinfe/semi-ui';
import { useSearchParams } from '@rspress/runtime';

import tagToInfos from 'my-virtual-tags';

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

  function onClickFactory(tag: string) {
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
        <Tag size="large" onClick={onClickFactory(tag)} color={getColor(tag)} key={tag}>
          {tag}
        </Tag>
      ))}
    </Space>
  );
}

// noinspection JSUnusedGlobalSymbols
export default function Archive() {
  return <TagsCloud />;
}

// noinspection JSUnusedGlobalSymbols
export const frontmatter = {
  sidebar: false,
  outline: false,
  footer: false,
};
