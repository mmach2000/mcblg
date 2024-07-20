import { useEffect, useState } from 'react';
import { getCustomMDXComponent as originalGet } from 'rspress/theme';

import { codeToHtml } from 'shiki';

interface CodeProps {
  children: string;
  className?: string;
  codeHighlighter?: 'prism' | 'shiki';
  meta?: string;
}

const OriginalCode = originalGet().code;
const langsUseShiki = new Set(['gleam']);
const shikiConfig = {
  themes: { light: 'github-light', dark: 'github-dark' },
  colorReplacements: {
    'github-dark': { '#24292e': '#242424' },
  },
};

export function ShikiCode({ code, lang }) {
  const [html, setHtml] = useState(`<code>${code}</code>`);

  useEffect(() => {
    codeToHtml(code, { lang, ...shikiConfig }).then(setHtml);
  }, []);

  // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
  return <code className={`language-${lang} !py-0`} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function FallBackCode(props: CodeProps) {
  const { className, children } = props;
  const lang = className.replace(/language-/, '');

  if (langsUseShiki.has(lang)) {
    return <ShikiCode code={children} lang={lang} />;
  }
  return <OriginalCode {...props}>{children}</OriginalCode>;
}
