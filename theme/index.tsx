import Theme, { getCustomMDXComponent as originalGet } from 'rspress/theme';

import { useMutationObserver } from 'ahooks';
import FallBackCode from './FallBackCode';

const customMDXComponent = originalGet();
customMDXComponent.code = FallBackCode;

// noinspection JSUnusedGlobalSymbols
export default Theme;
export * from 'rspress/theme';
// noinspection JSUnusedGlobalSymbols
export const getCustomMDXComponent = () => customMDXComponent;
