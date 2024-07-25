import { useEffect } from 'react';

// noinspection JSUnusedGlobalSymbols
export default function SideEffects() {
  useEffect(() => {
    // observe the class attribute of the <html> element,
    // and apply the theme mode to the body element for Semi Design
    const observer = new MutationObserver((mutationsList) => {
      const [mutation] = mutationsList;
      if ((mutation.target as HTMLHtmlElement).classList.contains('dark')) {
        window.document.body.setAttribute('theme-mode', 'dark');
      } else {
        window.document.body.setAttribute('theme-mode', 'light');
      }
    });
    observer.observe(window.document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      observer?.disconnect();
    };
  }, []);

  return null;
}
