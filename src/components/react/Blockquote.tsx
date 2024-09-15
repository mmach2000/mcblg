import React, { type ReactNode } from 'react';

function isHTMLString(value: any) {
  return Object.prototype.toString.call(value) === '[object HTMLString]';
}

export function Blockquote({ children }: { children: ReactNode }) {
  if (children && React.isValidElement(children) && isHTMLString(children.props.value)) {
    const innerHtml = children.props.value.replaceAll('<p>——', '<p style="text-align: right">——');
    // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
    return <blockquote dangerouslySetInnerHTML={{ __html: innerHtml }} />;
  }

  return (
    <blockquote>
      {children}
    </blockquote>
  );
}
