import { useMutationObserver } from 'ahooks';

// noinspection JSUnusedGlobalSymbols
export default function SideEffects() {
  // observe the class attribute of the <html> element,
  // and apply the theme mode to the body element for Semi Design
  useMutationObserver((mutationsList) => {
    const [mutation] = mutationsList;
    if ((mutation.target as HTMLHtmlElement).classList.contains('dark')) {
      window.document.body.setAttribute('theme-mode', 'dark');
    } else {
      window.document.body.setAttribute('theme-mode', 'light');
    }
  }, window.document.documentElement, { attributes: true, attributeFilter: ['class'] });

  return null;
}
