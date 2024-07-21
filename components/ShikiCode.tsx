import { useEffect, useState } from 'react';

import { codeToHtml } from 'shiki';

const shikiConfig = {
  themes: { light: 'github-light', dark: 'github-dark' },
  colorReplacements: {
    'github-dark': { '#24292e': '#242424' },
  },
};

export default function ShikiCode({ code, lang }) {
  const [html, setHtml] = useState(`<code>${code}</code>`);

  useEffect(() => {
    codeToHtml(code, { lang, ...shikiConfig }).then(setHtml);
  }, []);

  // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
  return <code className={`language-${lang} !py-0`} dangerouslySetInnerHTML={{ __html: html }} />;
}
