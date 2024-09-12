import { atomWithLocation } from 'jotai-location';
import { atom } from 'jotai/index';
import queryString from 'query-string';
import { isBrowser } from 'browser-or-node';
import { isEqual } from 'moderndash';

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

export const locationAtom = atomWithLocation({
  replace: true,
  getLocation: getQuery,
  applyLocation: applyQuery,
  subscribe: subscribeQuery,
});

export function createQueryAtom<T extends string[]>(key: string, defaultValue: T = [] as string[] as T) {
  return atom(
    get => (get(locationAtom)[key] ?? defaultValue) as T,
    (get, set, update: T) => {
      if (isEqual(get(locationAtom)[key], update)) {
        return;
      }
      set(locationAtom, prev => ({ ...prev, [key]: update }));
    },
  );
}
