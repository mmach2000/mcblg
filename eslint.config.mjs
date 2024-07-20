// eslint.config.mjs
import antfu from '@antfu/eslint-config';

export default antfu({
  isInEditor: true,
  react: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
}, {
  rules: {
    'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'no-console': 'off',
    'unused-imports/no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'off',
  },
});
