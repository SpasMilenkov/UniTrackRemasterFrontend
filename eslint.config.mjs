// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  rules: {
    'vue/first-attribute-linebreak': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/no-multiple-template-root': 'off',
  },
});
