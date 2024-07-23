import useUrlState from '@ahooksjs/use-url-state';

import { group } from 'radash';
import { Space, Tag, Timeline } from '@douyinfe/semi-ui';
import { IconFilter, IconPriceTag } from '@douyinfe/semi-icons';

import tagToRoutes from 'my-virtual-tags';
import routeToPageInfo from 'my-virtual-page-info';

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
export default function Archive() {
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

  const routeSet: string[] = filterTags.length > 0 // @ts-expect-error Difference is only supported in es2024
    ? new Set(filteredRoutes).difference(new Set(excludedRoutes)) // @ts-expect-error Difference is only supported in es2024
    : new Set(allRoutes).difference(new Set(excludedRoutes));
  const pageGroups = Object.entries(group(
    Array.from(routeSet).map(route => routeToPageInfo[route]),
    page => new Date(page.gitInfo.created).getFullYear(),
  ));

  return (
    <div>
      <TagsCloud className="mb-4" />
      {pageGroups.map(([year, pageGroup]) => (
        <div key={year}>
          <h1>{year}</h1>
          <Timeline>
            {pageGroup.map(page => (
              <Timeline.Item key={page.routePath} time={new Date(page.gitInfo.created).toLocaleDateString()}>
                <a href={page.routePath}>{page.title}</a>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
      ))}
    </div>
  );
}

// noinspection JSUnusedGlobalSymbols
export const frontmatter = {
  sidebar: false,
  outline: false,
  footer: false,
};
