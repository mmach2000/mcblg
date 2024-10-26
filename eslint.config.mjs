import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  astro: true,
  unocss: true,
  isInEditor: true,
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  ignores: [
    'src/content/docs/notes/test-page-md.md',
  ],
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
}, {
  rules: {
    'no-console': 'off',
    'antfu/no-top-level-await': 'off',
    'ts/strict-boolean-expressions': 'off',
    'react-refresh/only-export-components': 'off',
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
  },
});
