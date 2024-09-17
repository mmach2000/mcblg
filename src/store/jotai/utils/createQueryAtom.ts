import type { WritableAtom } from 'jotai/vanilla';
import { allQueryAtom, type QueryParams } from '@/store/jotai/location.ts';
import { atom } from 'jotai/index';
import { isEqual } from 'moderndash';

export function createQueryAtom<T extends string[]>(key: string, defaultValue: T = [] as string[] as T, options?: {
  replace?: boolean;
}) {
  return atom<T, [update: T], void>(
    get => (get(allQueryAtom)[key] ?? defaultValue) as T,
    (get, set, update: T) => {
      const query = get(allQueryAtom);
      if (isEqual(query[key], update)) {
        return;
      }

      set(
        // eslint-disable-next-line ts/no-unsafe-argument
        allQueryAtom as WritableAtom<QueryParams, any, void>,
        { ...query, [key]: update },
        { replace: options?.replace ?? false },
      );
    },
  );
}
