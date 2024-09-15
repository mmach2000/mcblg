import React, { type ReactNode } from 'react';

function isHTMLString(value: any) {
  return Object.prototype.toString.call(value) === '[object HTMLString]';
}

export function Blockquote({ children }: { children: ReactNode }) {
  if (children && React.isValidElement(children)) {
    const props = children.props as { value: string };
    if (isHTMLString(props.value) && props.value.includes('<p>——')) {
      const innerHtml = props.value.replaceAll('<p>——', '<p style="text-align: right">——');
      // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
      return <blockquote dangerouslySetInnerHTML={{ __html: innerHtml }} />;
    }
  }

  return (
    <blockquote>
      {children}
    </blockquote>
  );
}
