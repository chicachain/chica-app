// const jsExtensions = ['.js', '.jsx'];
// const tsExtensions = ['.ts', '.tsx'];
// const allExtensions = jsExtensions.concat(tsExtensions);
module.exports = {
  env: { browser: true, es6: true, node: true },
  extends: ['eslint:recommended', 'airbnb', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    'react/prop-types': 'off',
    'no-nested-ternary': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'no-unused-vars': 0,
    'no-unused-expressions': 'off',
    'import/no-named-as-default-member': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 0,
    'no-console': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
  // settings: {
  //   'import/extensions': allExtensions,
  //   'import/parsers': {
  //     '@typescript-eslint/parser': tsExtensions,
  //   },
  //   'import/resolver': {
  //     node: {
  //       extensions: allExtensions,
  //     },
  //   },
  // },
};
