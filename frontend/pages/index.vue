<script setup>
  // composables
  const query = useRoute().query
  const progs = useProgs()
  const auth = useAuth()
  const stick = useStick()

  // local page values
  const tab = ref(0)
  tab.value = '1'

  // computed values
  const watchedProgs = computed(() => {
    return progs.value.filter((p) => {
      return p.watching
    })
  })
  const futureProgs = computed(() => {
    const now = new Date().toISOString()
    return progs.value.filter((p) => {
      return p.date >= now
    })
  })

  // set manifest header
  useHead({
    link: [
      { rel: 'manifest', href: '/manifest.json' }
    ]
  })

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // if this is the first time,
  if (stick.value === false && progs.value.length === 0) {
    try {
      //  fetch the list from the API
      console.log('API', '/list', `${apiHome}/api/list`)
      const r = await useFetch(`${apiHome}/api/list`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      progs.value = r.data.value.list
    } catch (e) {
      console.error('failed to fetch list of progs', e)
    }
  }

  // reset the stick flag - it's set by add/delete/toggle
  // so we don't reload an eventually consistent copy
  stick.value = false

  function compareFn(a, b) {
    if (a.date < b.date) {
      return -1;
    } else if (a.date > b.date) {
      return 1;
    }
    return 0;
  }

  // sort into date order
  if (progs.value.length > 0) {
    progs.value.sort(compareFn)
  }

</script>
<template>
  <v-tabs v-model="tab" align-tabs="center">
    <v-tab value="1"><v-icon>mdi-all-inclusive</v-icon></v-tab>
    <v-tab value="2"><v-icon color="primary">mdi-television-play</v-icon></v-tab>
    <v-tab value="3"><v-icon color="secondary">mdi-calendar-clock</v-icon></v-tab>
  </v-tabs>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="1">
      <ProgList :progs="progs"></ProgList>
    </v-tabs-window-item>
    <v-tabs-window-item value="2">
      <ProgList :progs="watchedProgs"></ProgList>
    </v-tabs-window-item>
    <v-tabs-window-item value="3">
      <ProgList :progs="futureProgs"></ProgList>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

