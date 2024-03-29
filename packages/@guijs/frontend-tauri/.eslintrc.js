module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/standard',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // trailing comma
    'comma-dangle': ['error', 'always-multiline'],
    'no-inner-declarations': 'off',
    'vue/attribute-hyphenation': ['error', 'never'],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
