import type { AttributifyAttributes } from '@unocss/preset-attributify';

declare module 'react' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}
