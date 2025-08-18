<script setup>
const { tab } = useTab()
const { availableProgs, watchedProgs, futureProgs } = useProgsList()
</script>
<template>
  <!-- Tab navigation-->
  <v-container>
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab href="#ready" value="1">
        Ready
        <v-badge color="primary" :content="availableProgs.length" inline></v-badge>
      </v-tab>
      <v-tab href="#now" value="2">
        Now
        <v-badge color="green" :content="watchedProgs.length" inline></v-badge>
      </v-tab>
      <v-tab href="#future" value="3">
        Future
        <v-badge color="red" :content="futureProgs.length" inline></v-badge>
      </v-tab>
    </v-tabs>
  </v-container>
</template>
