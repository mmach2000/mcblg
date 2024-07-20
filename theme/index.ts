import Theme, { getCustomMDXComponent as originalGet } from 'rspress/theme';
import { FallBackCode } from './ShikiCode';

const customMDXComponent = originalGet();
customMDXComponent.code = FallBackCode;

export default Theme;
export * from 'rspress/theme';
export const getCustomMDXComponent = () => customMDXComponent;
