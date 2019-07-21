module.exports = {
  root: true,
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  globals: {
    name: 'off'
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
  }
}
