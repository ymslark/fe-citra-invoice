import { fileURLToPath } from 'node:url'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  // target: 'static',
  app: {
    head: {
      titleTemplate: '%s - ',
      title: 'Citra Invoice',

      link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: process.env.NUXT_APP_BASE_URL+'/favicon.ico',
      }],
    },
    baseURL: '/citra-invoice/'
  },

  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 3000
  },

  devtools: {
    enabled: true,
  },

  css: [
    '@core/scss/template/index.scss',
    '@styles/styles.scss',
    '@/plugins/iconify/icons.css',
  ],
  devServer: {
    port: 8000,
  },  

  /*
    ❗ Please read the docs before updating runtimeConfig
    https://nuxt.com/docs/guide/going-further/runtime-config
  */
  runtimeConfig: {
    // Private keys are only available on the server
    // AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    // AUTH_SECRET: process.env.AUTH_SECRET,
    BASE_URL_API: process.env.API_BASE_URL || 'http://localhost:3900',

    // Public keys that are exposed to the client.
// nuxt.config.ts
    public: {
      apiUrl: process.env.API_BASE_URL,
      appName: process.env.APP_NAME,
      debug: process.env.DEBUG === 'true'
    }
  },
  components: {
    dirs: [{
      path: '@/@core/components',
      pathPrefix: false,
    }, {
      path: '@/views/demos',
      pathPrefix: false,
    }, {
      path: '~/components/global',
      global: true,
    }, {
      path: '~/components',
      pathPrefix: true,
    }],
  },

  // auth: {
  //   baseURL: process.env.AUTH_ORIGIN,
  //   globalAppMiddleware: false,

  //   provider: {
  //     type: 'authjs',
  //   },
  // },
  compatibilityDate: '2029-02-12',
  plugins: [
    { src: '@/plugins/auth.client.js', mode: 'client' },
    { src: '@/plugins/persist.client.js', mode: 'client' },
    { src: '@/plugins/fetch.client.js', mode: 'client' },

    // '@/plugins/casl/index.js',
    { src: '@/plugins/vuetify/index.js' },
    { src: '@/plugins/iconify/index.js' },
  ],

  imports: {
    dirs: ['./@core/utils', './@core/composable/', './plugins/*/composables/*'],
  },

  hooks: {},

  experimental: {
    typedPages: true,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@/*': ['../*'],
          '@themeConfig': ['../themeConfig.js'],
          '@layouts/*': ['../@layouts/*'],
          '@layouts': ['../@layouts'],
          '@core/*': ['../@core/*'],
          '@core': ['../@core'],
          '@images/*': ['../assets/images/*'],
          '@styles/*': ['../assets/styles/*'],
          '@validators': ['../@core/utils/validators'],
          '@db/*': ['../server/fake-db/*'],
          '@api-utils/*': ['../server/utils/*'],
        },
      },
    },
  },

  // ℹ️ Disable source maps until this is resolved: https://github.com/vuetifyjs/vuetify-loader/issues/290
  sourcemap: {
    server: false,
    client: false,
  },

  vue: {
    compilerOptions: {
      isCustomElement: tag => tag === 'swiper-container' || tag === 'swiper-slide',
    },
  },

  vite: {
    define: { 'process.env': {} },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url)),
        '@themeConfig': fileURLToPath(new URL('./themeConfig.js', import.meta.url)),
        '@core': fileURLToPath(new URL('./@core', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./@layouts', import.meta.url)),
        '@images': fileURLToPath(new URL('./assets/images/', import.meta.url)),
        '@styles': fileURLToPath(new URL('./assets/styles/', import.meta.url)),
        '@configured-variables': fileURLToPath(new URL('./assets/styles/variables/_template.scss', import.meta.url)),
        '@db': fileURLToPath(new URL('./server/fake-db/', import.meta.url)),
        '@api-utils': fileURLToPath(new URL('./server/utils/', import.meta.url)),
      },
    },

    build: {
      chunkSizeWarningLimit: 5000,
    },

    optimizeDeps: {
      exclude: ['vuetify'],
      entries: [
        './**/*.vue',
      ],
    },

    plugins: [
      svgLoader(),
      vuetify({
        styles: {
          configFile: 'assets/styles/variables/_vuetify.scss',
        },
      }),
    ],
  },

  build: {
    transpile: ['vuetify'],
  },

  i18n: {
    vueI18n: 'i18n.config.js',
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/device',

    // '@sidebase/nuxt-auth',
    '@pinia/nuxt',
  ],
  router: {
    middleware: ['auth.client'],
  },
})
