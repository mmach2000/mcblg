import Theme, { getCustomMDXComponent as originalGet } from 'rspress/theme';
import { ShikiCode } from './ShikiCode';

const customMDXComponent = originalGet();
customMDXComponent.code = ShikiCode;

export default Theme;
export * from 'rspress/theme';
export const getCustomMDXComponent = () => customMDXComponent;
