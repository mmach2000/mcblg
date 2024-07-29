import { Empty } from '@douyinfe/semi-ui';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';

import routes from 'my-virtual-notes-routes';
import routeToPageInfo from 'my-virtual-notes-page-info';

import { PageList } from '@/components/PageList';

// noinspection JSUnusedGlobalSymbols
export default function Posts() {
  const [parent] = useAutoAnimate();
  console.log(routes);
  const pageGroup = routes.map(route => routeToPageInfo[route]);

  return (
    <div ref={parent} mt="md:8">
      {routes.length
        ? <PageList pages={pageGroup} />
        : (
            <Empty
              className="mt-8"
              image={<IllustrationNoContent />}
              darkModeImage={<IllustrationNoContentDark />}
              title="这里还空空如也……"
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
