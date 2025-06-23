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
    '@nuxt/image',
    '@vueuse/motion/nuxt',
    '@pinia/colada-nuxt',
    '@vite-pwa/nuxt',
  ],

  // SSR configuration
  ssr: true,

  // Pinia configuration
  pinia: {
    storesDirs: ['./stores/**'],
  },

  image: {
    format: ['webp', 'avif', 'jpeg', 'png'],
    quality: 90,
  },
  pwa: {
    registerType: 'autoUpdate',
    devOptions: {
      enabled: false,
      type: 'module',
    },
    manifest: {
      name: 'UniTrack: Education Unified',
      short_name: 'UniTrack',
      description:
        'UniTrack streamlines student management, grading, analytics, and academic planning for schools and universities. A modern platform simplifying education end-to-end.',
      theme_color: '#4ade80',
      icons: [
        {
          src: '/pwa-icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
          },
        },
      ],
    },
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
        dts: true,
      }),
      Components({
        resolvers: [NaiveUiResolver()],
        dts: true,
      }),
    ],
    define: {
      // 🔑 ENABLE hydration mismatch details for debugging
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__:
        process.env.NODE_ENV === 'development',
    },
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
    experimental: {
      wasm: true,
    },
    storage: {
      redis: {
        driver: 'memory',
      },
    },
  },

  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },

  build: {
    transpile: ['vueuc', 'ol'],
  },

  // 🔑 Enhanced app configuration for better hydration
  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      charset: 'utf-8',
    },
    // Add page transition to prevent flash during hydration
    pageTransition: { name: 'page', mode: 'out-in' },
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
        globInclude: ['components/**/*.vue'],
        globExclude: ['node_modules', 'dist'],
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
    compilation: {
      strictMessage: false,
    },
  },

  runtimeConfig: {
    public: {
      apiBaseURL:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:5086/api',
      socketURL: process.env.NUXT_PUBLIC_SOCKET_URL || 'http://localhost:5086',
      debug: process.env.NODE_ENV === 'development',
    },
  },

  experimental: {
    payloadExtraction: false,
  },

  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
});
