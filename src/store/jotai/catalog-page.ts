import { createQueryAtom } from '@/store/jotai/utils/createQueryAtom.ts';
import { QUERY_KEYS } from '@/utils/constants.ts';

export const SORT_METHODS = ['ctime', 'mtime', 'words'] as const;
export const SORT_ORDERS = ['asc', 'desc'] as const;
export const SORT_NAMES = {
  ctime: '创建时间',
  mtime: '修改时间',
  words: '字数',
  desc: '降序',
  asc: '升序',
};

export type SortMethod = typeof SORT_METHODS[number];
export type SortOrder = typeof SORT_ORDERS[number];

export const includeAtom = createQueryAtom<string[]>(QUERY_KEYS.include, []);
export const excludeAtom = createQueryAtom<string[]>(QUERY_KEYS.exclude, []);
export const sortAtom = createQueryAtom<[SortMethod]>(QUERY_KEYS.sort, ['ctime']);
export const orderAtom = createQueryAtom<[SortOrder]>(QUERY_KEYS.order, ['desc']);
