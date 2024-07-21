import { getCustomMDXComponent as originalGet } from 'rspress/theme';

import ShikiCode from '../components/ShikiCode';

interface CodeProps {
  children: string;
  className?: string;
  codeHighlighter?: 'prism' | 'shiki';
  meta?: string;
}

const OriginalCode = originalGet().code;
const langsUseShiki = new Set(['gleam']);

export default function FallBackCode(props: CodeProps) {
  const { className, children } = props;
  const lang = className.replace(/language-/, '');

  if (langsUseShiki.has(lang)) {
    return <ShikiCode code={children} lang={lang} />;
  }
  return <OriginalCode {...props}>{children}</OriginalCode>;
}
