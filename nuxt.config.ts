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
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/eslint',
    'nuxtjs-naive-ui',
    '@nuxtjs/i18n',
    '@nuxt/image',
    '@vueuse/motion/nuxt',
  ],
  image: {
    format: ['webp', 'avif', 'jpeg', 'png'],
    quality: 90,
  },
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
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  build: {
    transpile: ['vueuc', 'ol'],
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
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5086/api',
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
});
