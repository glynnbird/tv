// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vite-pwa/nuxt'
  ],
  ssr: false,
  pwa: {
    strategies: 'generateSW',
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    manifest: {
        "short_name": "TV",
        "name": "TV Helper",
        "icons": [
          {
            "src": "/tv_192.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "/tv_512.png",
            "type": "image/png",
            "sizes": "512x512"
          }
        ],
        "id": "/?source=pwa",
        "start_url": "/?source=pwa",
        "background_color": "#FFFFFF",
        "display": "standalone",
        "scope": "/",
        "theme_color": "#3367D6",
        "description": "TV programme planner"
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg}']
    },
    devOptions: {
      enabled: false,
      type: "module"
    }
  },

  runtimeConfig: {
    public: {
      apiBase: 'https://tv.glynnbird.com'
    }
  },

  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css'
  ],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    }
  },

  compatibilityDate: '2024-09-24'
})
