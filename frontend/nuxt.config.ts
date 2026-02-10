// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    // from https://github.com/vite-pwa/nuxt?tab=readme-ov-file#-usage
    '@vite-pwa/nuxt'
  ],
  vite: {
    plugins: [
      // @ts-expect-error
      vuetify({ autoImport: true })
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    }
  },
  app: {
    head: {
      link: [
        { rel:"manifest", href:"/manifest.webmanifest"  }
      ]
    }
  },
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
      apiBase: ''
    }
  },
  compatibilityDate: '2025-08-04',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 5,
  }
})
