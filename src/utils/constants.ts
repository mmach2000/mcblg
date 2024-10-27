export const IS_DEV = import.meta.env.DEV;
export const IS_PROD = import.meta.env.PROD;

export const SERIES_NAMES: Record<string, string> = {
  'interesting-pl': '小众/新潮编程语言体验',
  'translations': '翻译',
  'eight-legged-fe': '前端八股',
} as const;

export const QUERY_KEYS = {
  include: 'i',
  exclude: 'e',
  sort: 's',
  order: 'o',
} as const;

export const LICENSE_DATA = {
  'CC0-1.0': { name: 'CC0 1.0 通用协议', url: 'https://creativecommons.org/publicdomain/zero/1.0', icons: ['cc', 'zero'] as const },
  'CC-BY-4.0': { name: '知识共享 署名 4.0 协议', url: 'https://creativecommons.org/licenses/by/4.0', icons: ['cc', 'by'] as const },
  'CC-BY-SA-4.0': { name: '知识共享 署名-相同方式共享 4.0 协议', url: 'https://creativecommons.org/licenses/by-sa/4.0', icons: ['cc', 'by', 'sa'] as const },
  'CC-BY-NC-4.0': { name: '知识共享 署名-非商业性使用 4.0 协议', url: 'https://creativecommons.org/licenses/by-nc/4.0', icons: ['cc', 'by', 'nc'] as const },
  'CC-BY-ND-4.0': { name: '知识共享 署名-禁止演绎 4.0 协议', url: 'https://creativecommons.org/licenses/by-nd/4.0', icons: ['cc', 'by', 'nd'] as const },
  'CC-BY-NC-SA-4.0': { name: '知识共享 署名-非商业性使用-相同方式共享 4.0 协议', url: 'https://creativecommons.org/licenses/by-nc-sa/4.0', icons: ['cc', 'by', 'nc', 'sa'] as const },
  'CC-BY-NC-ND-4.0': { name: '知识共享 署名-非商业性使用-禁止演绎 4.0 协议', url: 'https://creativecommons.org/licenses/by-nc-nd/4.0', icons: ['cc', 'by', 'nc', 'nd'] as const },
};

export const PSEUDO_LICENSE_DATA = {
  ...LICENSE_DATA,
  FU: { url: 'https://en.wikipedia.org/wiki/Fair_use', icons: ['fu'] as const },
  REMIX: { url: undefined, icons: ['remix'] as const },
};

export const CC_ICONS = {
  cc: 'i-cc-icons:cc',
  by: 'i-cc-icons:by',
  sa: 'i-cc-icons:sa',
  nc: 'i-cc-icons:nc-jp',
  nd: 'i-cc-icons:nd',
  fu: 'i-cc-icons:fu',
  zero: 'i-cc-icons:zero',
  remix: 'i-cc-icons:remix',
};

export const LICENSES = Object.keys(LICENSE_DATA) as [(keyof typeof LICENSE_DATA), ...(keyof typeof LICENSE_DATA)[]];
export const PSEUDO_LICENSES = Object.keys(PSEUDO_LICENSE_DATA) as [(keyof typeof PSEUDO_LICENSE_DATA), ...(keyof typeof PSEUDO_LICENSE_DATA)[]];
