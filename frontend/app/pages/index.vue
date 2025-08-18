<script setup>
// composables
const { $pwa } = useNuxtApp()
const { tab } = useTab()

// local page values
const lookup = {
  '#ready': '1',
  '#now': '2',
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


  <!-- tab content -->
  <TabContent></TabContent>
</template>
