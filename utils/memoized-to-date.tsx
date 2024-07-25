import { memoize } from 'moderndash';

export const memoizedToDate = memoize((s: string) => {
  return new Date(s);
});
