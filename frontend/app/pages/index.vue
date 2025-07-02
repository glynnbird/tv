<script setup>
  // composables
  const { $pwa } = useNuxtApp()
  const { availableProgs,  watchedProgs, futureProgs } = useProgsList()

  // local page values
  const tab = ref('1')
  const lookup = {
    '#ready': '1',
    '#watching': '2',
    '#future': '3'
  }
  if (window.location.hash) {
    tab.value = lookup[window.location.hash]
  }

</script>
<template>
  <!-- PWA refresh banner-->
  <v-alert color="warning" v-show="$pwa.needRefresh">
    <h4> New content available, click on reload button to update. </h4>
    <v-btn color="primary" @click="$pwa.updateServiceWorker()">Reload</v-btn>
  </v-alert>

  <!-- Tab navigation-->
  <v-tabs v-model="tab" align-tabs="center">
    <v-tab href="#ready" value="1">Ready</v-tab>
    <v-tab href="#watching" value="2">Watching</v-tab>
    <v-tab href="#future" value="3">Future</v-tab>
  </v-tabs>

  <!-- tab content -->
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="1">
      <ProgList :progs="availableProgs"></ProgList>
    </v-tabs-window-item>
    <v-tabs-window-item value="2">
      <ProgList :progs="watchedProgs"></ProgList>
    </v-tabs-window-item>
    <v-tabs-window-item value="3">
      <ProgList :progs="futureProgs"></ProgList>
    </v-tabs-window-item>
  </v-tabs-window>
</template>
