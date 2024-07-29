import type { AttributifyAttributes } from '@unocss/preset-attributify';

declare module 'react' {
  // noinspection JSUnusedGlobalSymbols
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}
