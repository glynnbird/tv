// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [],
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
  },

  compatibilityDate: '2024-09-24'
})