import useUrlState from '@ahooksjs/use-url-state';
import { IconFilter, IconPriceTag } from '@douyinfe/semi-icons';
import { Space, Tag } from '@douyinfe/semi-ui';
import { InitialUrlState, UrlStateOptions } from '@/constants/url-state';

export function TagsCloud({ tags, className }: { tags: string[]; className?: string }) {
  const [state, setState] = useUrlState(InitialUrlState, UrlStateOptions);
  const filterTags = new Set<string>([state.filter].flat());
  const excludeTags = new Set<string>([state.exclude].flat());

  function getStyle(tag: string) {
    if (filterTags.has(tag)) {
      return { color: 'blue' as const, prefixIcon: <IconFilter /> };
    } else if (excludeTags.has(tag)) {
      return { color: 'red' as const, prefixIcon: <IconFilter /> };
    }
    return { prefixIcon: <IconPriceTag /> };
  }

  function onClickFactory(tag: string) {
    return () => {
      if (filterTags.has(tag)) {
        filterTags.delete(tag);
        excludeTags.add(tag);
      } else if (excludeTags.has(tag)) {
        excludeTags.delete(tag);
      } else {
        filterTags.add(tag);
      }

      setState({
        filter: Array.from(filterTags),
        exclude: Array.from(excludeTags),
      });
    };
  }

  return (
    <Space wrap className={className}>
      {tags.map(tag => (
        <Tag
          key={tag}
          size="large"
          {...getStyle(tag)}
          onClick={onClickFactory(tag)}
        >
          {tag}
        </Tag>
      ))}
    </Space>
  );
}
