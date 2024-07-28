import useUrlState from '@ahooksjs/use-url-state';

import { sort } from 'moderndash';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { IconFilter, IconPriceTag } from '@douyinfe/semi-icons';
import { Divider, Empty, Space, Tag, Typography } from '@douyinfe/semi-ui';
import { IllustrationNoResult, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';

import tagToRoutes from 'my-virtual-tags';
import routeToPageInfo from 'my-virtual-page-info';

import type { RuntimePageInfo } from '@/typing';
import { memoizedToDate } from '@/utils/memoized-to-date';
import { PageList } from '@/components/PageList';

const InitialUrlState = { filter: [], exclude: [] };
const UrlStateOptions = {
  parseOptions: { arrayFormat: 'separator' as const, arrayFormatSeparator: '|' },
  stringifyOptions: { arrayFormat: 'separator' as const, arrayFormatSeparator: '|' },
};

export function TagsCloud({ className }: { className?: string }) {
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
      {Object.keys(tagToRoutes).map(tag => (
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

// noinspection JSUnusedGlobalSymbols
export default function Posts() {
  const [parent] = useAutoAnimate();
  const [state, setState] = useUrlState(InitialUrlState, UrlStateOptions);

  const filterTags = [state.filter].flat();
  const excludeTags = [state.exclude].flat();

  const allRoutes = Object.values(tagToRoutes).flat();
  const filteredRoutes = Object.entries(tagToRoutes)
    .filter(([tag]) => filterTags.includes(tag))
    .flatMap(([, routes]) => routes);
  const excludedRoutes = Object.entries(tagToRoutes)
    .filter(([tag]) => excludeTags.includes(tag))
    .flatMap(([, routes]) => routes);

  const routeSet: Set<string> = filterTags.length > 0 // @ts-expect-error Set.prototype.Difference is only supported in es2024
    ? new Set(filteredRoutes).difference(new Set(excludedRoutes)) // @ts-expect-error The same as above
    : new Set(allRoutes).difference(new Set(excludedRoutes));
  // @ts-expect-error Object.groupBy is only supported in es2024
  const pageGroups: Record<string, RuntimePageInfo[]> = Object.groupBy(
    Array.from(routeSet).map(route => routeToPageInfo[route]),
    ({ gitInfo: { created } }) => memoizedToDate(created).getFullYear(),
  );
  const sortedPageGroups = sort(Object.entries(pageGroups), { order: 'desc', by: item => item[0] });

  const handleResetFilters = () => {
    setState(InitialUrlState);
  };

  return (
    <div ref={parent}>
      <TagsCloud className="mt-4" />
      <Divider className="!my-4" />
      {routeSet.size
        ? sortedPageGroups.map(([year, pageGroup]) => (
          <div key={year} className="space-y-4">
            <Typography.Title className="inline">{year}</Typography.Title>
            <PageList pages={pageGroup} />
            <Divider className="!my-4" />
          </div>
        ))
        : (
            <Empty
              className="mt-8"
              image={<IllustrationNoResult />}
              darkModeImage={<IllustrationNoResultDark />}
              title="暂未找到匹配的筛选结果"
              description={(
                <span>
                  <Typography.Text>试试 </Typography.Text>
                  <a onClick={handleResetFilters}>
                    <Typography.Text link>重置筛选条件</Typography.Text>
                  </a>
                </span>
              )}
            />
          )}
      {}
    </div>
  );
}

// noinspection JSUnusedGlobalSymbols
export const frontmatter = {
  sidebar: false,
  outline: false,
  footer: false,
};
