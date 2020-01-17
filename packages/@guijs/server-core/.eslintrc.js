module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'standard',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  settings: {},
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // trailing comma
    'comma-dangle': ['error', 'always-multiline'],
    // ts-ignore
    '@typescript-eslint/ban-ts-ignore': 1,
    // semis
    '@typescript-eslint/member-delimiter-style': [2, {
      multiline: { delimiter: 'none' },
      singleline: { delimiter: 'comma' },
    }],
    // @TODO fix the warnings below
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-empty-interface': 0,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  }
}
