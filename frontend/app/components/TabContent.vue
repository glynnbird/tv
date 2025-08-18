<script setup>
const { tab } = useTab()
const { availableProgs, watchedProgs, futureProgs } = useProgsList()
</script>
<template>
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
