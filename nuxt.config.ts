import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@vee-validate/nuxt',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxt/eslint',
    'nuxtjs-naive-ui',
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
  build: {
    transpile: ['vueuc'],
  },
   tailwindcss: {
    configPath: 'tailwind.config',
    exposeConfig: {
      level: 2
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
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
});
