export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

export const SERIES_NAMES: Record<string, string> = {
  'interesting-pl': '小众/新潮编程语言体验',
  'translations': '翻译',
  'eight-legged-fe': '前端八股',
};

export const QUERY_KEYS = {
  include: 'i',
  exclude: 'e',
  sort: 's',
  order: 'o',
};

export const SUPPORT_LICENSES = ['CC0-1.0'] as const;
