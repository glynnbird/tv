<script setup>
  // composables
  const { $pwa } = useNuxtApp()
  const progs = useProgs()
  const auth = useAuth()
  const stick = useStick()
  const PROGS_KEY = 'progscache'

  // local page values
  const tab = ref('1')
  if (window.location.hash) {
    tab.value = decodeURIComponent(window.location.hash.replace('#', ''))
  }

  // sort programmes newest first
  const newestFirst = function(a, b) {
    if (a.date < b.date) {
      return 1;
    } else if (a.date > b.date) {
      return -1;
    }
    return 0;
  }

  // sort programmes oldest first
  function oldestFirst(a, b) {
    if (a.date < b.date) {
      return -1;
    } else if (a.date > b.date) {
      return 1;
    }
    return 0;
  }

  // sort programmes most recently updated first
  function mostRecentlyUpdatedFirst(a, b) {
    a.ts = a.ts || 0
    b.ts = b.ts || 0
    if (a.ts < b.ts) {
      return 1;
    } else if (a.ts > b.ts) {
      return -1;
    }
    return 0;
  }

  // computed values
  const availableProgs = computed(() => {
    const now = new Date().toISOString()
    return progs.value.filter((p) => {
      return p.date <= now && !p.watching
    }).sort(newestFirst)
  })
  const watchedProgs = computed(() => {
    return progs.value.filter((p) => {
      return p.watching
    }).sort(mostRecentlyUpdatedFirst)
  })
  const futureProgs = computed(() => {
    const now = new Date().toISOString()
    return progs.value.filter((p) => {
      return p.date >= now
    }).sort(oldestFirst)
  })

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // if this is the first time,
  if (stick.value === false && progs.value.length === 0) {
    // see if we have any cached progs
    const cache = localStorage.getItem(PROGS_KEY)
    if (cache) {
      console.log('restoring pages from cache for faster startup')
      progs.value = JSON.parse(cache)
    }

    try {
      //  fetch the list from the API
      console.log('API', '/list', `${apiHome}/api/list`)
      const r = await $fetch(`${apiHome}/api/list`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      progs.value = r.list
      localStorage.setItem(PROGS_KEY, JSON.stringify(progs.value))
    } catch (e) {
      console.error('failed to fetch list of progs', e)
    }
  }

  // reset the stick flag - it's set by add/delete/toggle
  // so we don't reload an eventually consistent copy
  stick.value = false

  function tabSelected() {
    window.location.hash = tab.value
  }

</script>
<template>
  <v-alert color="warning" v-show="$pwa.needRefresh">
    <h4> New content available, click on reload button to update. </h4>
    <v-btn color="primary" @click="$pwa.updateServiceWorker()">Reload</v-btn>
  </v-alert>
  <v-tabs v-model="tab" align-tabs="center" @update:model-value="tabSelected()">
    <v-tab value="1">Ready</v-tab>
    <v-tab value="2">Watching</v-tab>
    <v-tab value="3">Future</v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="1">
      <ProgList :progs="availableProgs" heading="Ready"></ProgList>
    </v-tabs-window-item>
    <v-tabs-window-item value="2">
      <ProgList :progs="watchedProgs" heading="Watching"></ProgList>
    </v-tabs-window-item>
    <v-tabs-window-item value="3">
      <ProgList :progs="futureProgs" heading="Future"></ProgList>
    </v-tabs-window-item>
  </v-tabs-window>
</template>
