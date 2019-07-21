module.exports = {
  root: true,

  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],

  globals: {
    ClientAddonApi: false,
    name: 'off'
  },

  plugins: [
    'graphql'
  ],

  rules: {
    'vue/html-self-closing': 'error',
    'vue/no-use-v-if-with-v-for': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/return-in-computed-property': 'warn',
    'comma-dangle': ['error', 'always-multiline'],
  },

  parserOptions: {
    parser: 'babel-eslint'
  }
}
