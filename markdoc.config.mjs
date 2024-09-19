import { component, defineMarkdocConfig } from '@astrojs/markdoc/config';
import starlightMarkdoc from '@astrojs/starlight-markdoc';

export default defineMarkdocConfig({
  extends: [starlightMarkdoc()],
  tags: {
    'original-text': {
      render: component('./src/components/astro/markdown/OriginalText.astro'),
      children: ['paragraph', 'tag', 'list'],
    },
  },
});
