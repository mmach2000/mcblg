import useUrlState from '@ahooksjs/use-url-state';

import { sort } from 'moderndash';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Divider, Empty, Typography } from '@douyinfe/semi-ui';
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
  IllustrationNoResult,
  IllustrationNoResultDark,
} from '@douyinfe/semi-illustrations';

import tagToRoutes from 'my-virtual-posts-tags';
import routeToPageInfo from 'my-virtual-posts-page-info';

import { PageList } from '@/components/PageList';
import { TagsCloud } from '@/components/TagsCloud';
import { memoizedToDate } from '@/utils/memoized-to-date';
import { InitialUrlState, UrlStateOptions } from '@/constants/url-state';

// noinspection JSUnusedGlobalSymbols
export default function PostsPage() {
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
  const pageGroups: Record<string, string[]> = Object.groupBy(Array.from(routeSet), (route: string) =>
    memoizedToDate(routeToPageInfo[route].gitInfo.created).getFullYear());
  const sortedPageGroups = sort(Object.entries(pageGroups), { order: 'desc', by: ([year,,]) => year });

  const handleResetFilters = () => {
    setState(InitialUrlState);
  };

  if (!Object.keys(tagToRoutes).length) {
    return (
      <Empty
        className="mt-8"
        image={<IllustrationNoContent />}
        darkModeImage={<IllustrationNoContentDark />}
        title="这里还空空如也……"
      />
    );
  }

  return (
    <div ref={parent}>
      <TagsCloud tags={Object.keys(tagToRoutes)} className="mt-4" />
      <Divider className="!my-4" />
      {routeSet.size
        ? sortedPageGroups.map(([year, routes]) => (
          <div key={year} className="space-y-4">
            <Typography.Title className="inline">{year}</Typography.Title>
            <PageList routes={routes} pageInfos={routeToPageInfo} path="posts" />
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
