import type { WritableAtom } from 'jotai/vanilla';
import { isBrowser } from 'browser-or-node';
import { atom } from 'jotai/index';
import { atomWithLocation } from 'jotai-location';
import { isEqual } from 'moderndash';
import queryString from 'query-string';

const QUERY_STRING_OPTION = { arrayFormat: 'separator' as const, arrayFormatSeparator: '|' as const };

type QueryParams = Record<string, string[]>;

export function normalizeQuery(query: string | (string | null)[] | null): string[] {
  if (query === null || query === undefined) {
    return [];
  }
  if (typeof query === 'string') {
    return [query];
  }
  return query.filter(Boolean) as string[];
}

export function getFromSearch<T extends string[]>(key: string, defaultValue: T, search?: string) {
  if (!search) {
    return defaultValue;
  }

  const parsed = queryString.parse(search, QUERY_STRING_OPTION);
  return normalizeQuery(parsed[key]) as T;
}

function getQuery(): QueryParams {
  if (!isBrowser) {
    return {};
  }

  const parsed = queryString.parse(window.location.search.toString(), QUERY_STRING_OPTION);
  return Object.fromEntries(
    Object.entries(parsed).map(
      ([key, value]) => [key, normalizeQuery(value)],
    ),
  );
}

function applyQuery(
  query: QueryParams,
  options?: { replace?: boolean },
): void {
  if (!isBrowser) {
    return;
  }

  const url = new URL(window.location.href);
  url.search = queryString.stringify(query, QUERY_STRING_OPTION);
  if (options?.replace) {
    window.history.replaceState(window.history.state, '', url);
  } else {
    window.history.pushState(null, '', url);
  }
}

function subscribeQuery(callback: () => void) {
  if (!isBrowser) {
    return () => {};
  }

  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

export const allQueryAtom = atomWithLocation<QueryParams>({
  replace: true,
  getLocation: getQuery,
  applyLocation: applyQuery,
  subscribe: subscribeQuery,
});

export function createQueryAtom<T extends string[]>(key: string, defaultValue: T = [] as string[] as T, options?: { replace?: boolean }) {
  return atom<T, [update: T], void>(
    get => (get(allQueryAtom)[key] ?? defaultValue) as T,
    (get, set, update: T) => {
      const query = get(allQueryAtom);
      if (isEqual(query[key], update)) {
        return;
      }
      // eslint-disable-next-line ts/no-unsafe-argument
      set(allQueryAtom as WritableAtom<QueryParams, any, void>, { ...query, [key]: update }, { replace: options?.replace ?? false });
    },
  );
}
