// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'TV Helper',
      short_name: 'TV',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'tv_192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'tv_512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'tv_512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        }
      ]
    }
  },
  ssr: false,
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
  }
})
