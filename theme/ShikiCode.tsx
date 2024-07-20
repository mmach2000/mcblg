import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

export function ShikiCode({ children, className }) {
  const [html, setHtml] = useState(`<code>${children}</code>`);

  const language: string = className.replace(/language-/, '');

  useEffect(() => {
    codeToHtml(children, { lang: language, theme: 'nord' })
      .then((html) => {
        setHtml(html);
      });
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
