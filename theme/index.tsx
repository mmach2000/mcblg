import Theme, { getCustomMDXComponent as originalGet } from 'rspress/theme';

import { useMutationObserver } from 'ahooks';
import FallBackCode from './FallBackCode';

const customMDXComponent = originalGet();
customMDXComponent.code = FallBackCode;

function Layout() {
  useMutationObserver((mutationsList) => {
    const [mutation] = mutationsList;
    if ((mutation.target as HTMLHtmlElement).classList.contains('dark')) {
      window.document.body.setAttribute('theme-mode', 'dark');
    } else {
      window.document.body.setAttribute('theme-mode', 'light');
    }
  }, window.document.documentElement, { attributes: true, attributeFilter: ['class'] });

  return (
    <Theme.Layout />
  );
}

// noinspection JSUnusedGlobalSymbols
export default { ...Theme, Layout };
export * from 'rspress/theme';
// noinspection JSUnusedGlobalSymbols
export const getCustomMDXComponent = () => customMDXComponent;
