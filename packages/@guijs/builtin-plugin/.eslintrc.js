module.exports = {
  root: true,
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  globals: {
    name: 'off'
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
  }
}
