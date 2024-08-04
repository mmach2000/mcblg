import Theme from 'rspress/theme';
import { PageInfo } from '@/components/PageInfo';

const Layout = () => <Theme.Layout beforeDocContent={<PageInfo />} />;

// noinspection JSUnusedGlobalSymbols
export default {
  ...Theme,
  Layout,
};

export * from 'rspress/theme';
