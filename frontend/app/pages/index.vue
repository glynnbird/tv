<script setup>
  // composables
  const { $pwa } = useNuxtApp()
  const { availableProgs,  watchedProgs, futureProgs } = useProgsList()

  // local page values
  const tab = ref('1')
  if (window.location.hash) {
    tab.value = decodeURIComponent(window.location.hash.replace('#', ''))
  }

  function tabSelected() {
    window.location.hash = tab.value
  }

</script>
<template>
  <!-- PWA refresh banner-->
  <v-alert color="warning" v-show="$pwa.needRefresh">
    <h4> New content available, click on reload button to update. </h4>
    <v-btn color="primary" @click="$pwa.updateServiceWorker()">Reload</v-btn>
  </v-alert>

  <!-- Tab navigation-->
  <v-tabs v-model="tab" align-tabs="center" @update:model-value="tabSelected()">
    <v-tab value="1">Ready</v-tab>
    <v-tab value="2">Watching</v-tab>
    <v-tab value="3">Future</v-tab>
  </v-tabs>

  <!-- tab content -->
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
