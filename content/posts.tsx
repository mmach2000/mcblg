import useUrlState from '@ahooksjs/use-url-state';

import { format } from 'date-fns';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { IconFilter, IconPriceTag } from '@douyinfe/semi-icons';
import { Divider, Empty, Space, Tag, Typography } from '@douyinfe/semi-ui';
import { IllustrationNoResult, IllustrationNoResultDark } from '@douyinfe/semi-illustrations';

import tagToRoutes from 'my-virtual-tags';
import routeToPageInfo from 'my-virtual-page-info';
import type { RuntimePageInfo } from '../typing';

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

function YearAndPosts({ year, pages }: { year: string; pages: RuntimePageInfo[] }) {
  const [parent] = useAutoAnimate();
  return (
    <div key={year} className="space-y-4 items-start">
      <Typography.Title className="inline">{year}</Typography.Title>
      <ul ref={parent} className="space-y-3">
        {pages.map((page) => {
          const date = format(new Date(page.gitInfo.created), 'MM/dd');
          const readTime = page.readTime.text;
          return (
            <li key={page.routePath}>
              <a href={page.routePath} className="group" flex="~ items-baseline gap-3">
                <span text="xl zinc-900 dark:zinc-100 hover-op">{page.title}</span>
                <span text="sm zinc-600 dark:zinc-400 hover-op">{date}</span>
                <span text="sm zinc-500 dark:zinc-500 hover-op">·</span>
                <span text="sm zinc-400 dark:zinc-600 hover-op">{readTime}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <Divider className="!my-4" />
    </div>
  );
}

// noinspection JSUnusedGlobalSymbols
export default function Posts() {
  const [parent] = useAutoAnimate();
  const [state] = useUrlState(InitialUrlState, UrlStateOptions);

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
    ? new Set(filteredRoutes).difference(new Set(excludedRoutes)) // @ts-expect-error Same as above
    : new Set(allRoutes).difference(new Set(excludedRoutes));
  // @ts-expect-error Object.groupBy is only supported in es2024
  const pageGroups: Record<string, RuntimePageInfo[]> = Object.groupBy(
    Array.from(routeSet).map(route => routeToPageInfo[route]),
    ({ gitInfo: { created } }) => new Date(created).getFullYear(),
  );

  return (
    <div ref={parent}>
      <TagsCloud className="mt-4" />
      <Divider className="!my-4" />
      {routeSet.size
        ? Object.entries(pageGroups).map(([year, pageGroup]) => (
          <YearAndPosts key={year} year={year} pages={pageGroup} />
        ))
        : (
            <Empty
              image={<IllustrationNoResult style={{ width: 150, height: 150 }} />}
              darkModeImage={<IllustrationNoResultDark style={{ width: 150, height: 150 }} />}
              description="空空如也……"
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
