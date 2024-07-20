import { getCustomMDXComponent as originalGet } from 'rspress/theme';

import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

interface CodeProps {
  children: string;
  className?: string;
  codeHighlighter?: 'prism' | 'shiki';
  meta?: string;
}

const customMDXComponent = originalGet();
const langsUseShiki = new Set(['gleam']);
const shikiConfig = {
  themes: { light: 'min-light', dark: 'min-dark' },
  colorReplacements: {
    'min-dark': { '#1f1f1f': '#242424' },
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
  const lang: string = className.replace(/language-/, '');
  if (langsUseShiki.has(lang)) {
    return <ShikiCode code={children} lang={lang} />;
  }
  return (
    <customMDXComponent.code {...props}>
      {children}
    </customMDXComponent.code>
  );
}
