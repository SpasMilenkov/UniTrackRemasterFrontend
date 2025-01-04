import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxt/eslint',
    'nuxtjs-naive-ui',
    '@nuxtjs/i18n',
  ],
  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': [
              'useDialog',
              'useMessage',
              'useNotification',
              'useLoadingBar',
              'NCard',
            ],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  build: {
    transpile: ['vueuc'],
  },
  tailwindcss: {
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2,
    },
    config: {},
    viewer: true,
  },
  icon: {
    clientBundle: {
      scan: {
        // note that when you specify those values, the default behavior will be overridden
        globInclude: ['components/**/*.vue' /* ... */],
        globExclude: ['node_modules', 'dist' /* ... */],
      },
    },
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'en', language: 'en-US' },
      { code: 'bg', language: 'bg' },
    ],
    defaultLocale: 'en',
  },
  runtimeConfig: {
    public: {
      apiBaseURL:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5086',
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
});
