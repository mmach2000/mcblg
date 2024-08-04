export const InitialUrlState = { filter: [], exclude: [] };

export const UrlStateOptions = {
  parseOptions: { arrayFormat: 'separator' as const, arrayFormatSeparator: '|' },
  stringifyOptions: { arrayFormat: 'separator' as const, arrayFormatSeparator: '|' },
};
