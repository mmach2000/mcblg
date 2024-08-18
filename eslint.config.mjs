import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  astro: true,

  isInEditor: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
}, {
  rules: {
    'no-console': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react-refresh/only-export-components': 'off',
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
  },
});
