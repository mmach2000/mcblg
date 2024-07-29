// eslint.config.mjs
// noinspection JSUnusedGlobalSymbols

import antfu from '@antfu/eslint-config';

// noinspection JSCheckFunctionSignatures
export default antfu({
  isInEditor: true,
  react: true,
  unocss: true,
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
