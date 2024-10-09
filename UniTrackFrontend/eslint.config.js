import vuePlugin from 'eslint-plugin-vue';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    languageOptions: {
      parser: babelParser,
    },
    plugins: {
      vue: vuePlugin,
      prettier: prettierPlugin,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-essential',
      '@vue/eslint-config-prettier',
    ],
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'prettier/prettier': 'error',
    },
  },
];
