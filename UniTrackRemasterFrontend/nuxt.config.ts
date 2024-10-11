export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@bg-dev/nuxt-naiveui',
    '@nuxt/eslint',
  ],
  icon: {
    clientBundle: {
      scan: {
        // note that when you specify those values, the default behavior will be overridden
        globInclude: ['components/**/*.vue' /* ... */],
        globExclude: ['node_modules', 'dist' /* ... */],
      },
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
});