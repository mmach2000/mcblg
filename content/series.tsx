import { Empty } from '@douyinfe/semi-ui';
import { IllustrationNoContent, IllustrationNoContentDark } from '@douyinfe/semi-illustrations';

// noinspection JSUnusedGlobalSymbols
export default function SeriesPage() {
  return (
    <Empty
      className="mt-8"
      image={<IllustrationNoContent />}
      darkModeImage={<IllustrationNoContentDark />}
      title="这里还空空如也……"
    />
  );
}

// noinspection JSUnusedGlobalSymbols
export const frontmatter = {
  sidebar: false,
  outline: false,
  footer: false,
};
