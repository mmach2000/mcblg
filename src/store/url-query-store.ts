import { getQuery, withQuery } from 'ufo';
import { isBrowser } from 'browser-or-node';
import { atom, onMount } from 'nanostores';

export const $urlQueryStore = atom({});

export function setQuery(query: Record<string, string | string[]>) {
  if (isBrowser) {
    const oldQuery = getQuery(window.location.href);
    const newQuery = { ...oldQuery, ...query };
    window.history.pushState({}, '', withQuery(window.location.href, newQuery));
    $urlQueryStore.set(newQuery);
  }
}

function historyListener() {
  if (isBrowser) {
    const query = getQuery(window.location.href);
    $urlQueryStore.set(query);
  }
}

onMount($urlQueryStore, () => {
  if (isBrowser) {
    const query = getQuery(window.location.href);
    $urlQueryStore.set(query);
    window.addEventListener('popstate', historyListener);
    return () => {
      window.removeEventListener('popstate', historyListener);
    };
  }
});
