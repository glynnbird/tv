<script setup>
const { tab } = useTab()
const { readonly } = defineProps({ readonly: Boolean })
const { availableProgs, watchedProgs, futureProgs } = useProgsList()
</script>
<template>
  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="1">
      <ProgList :progs="availableProgs" :readonly="readonly"></ProgList>
    </v-tabs-window-item>
    <v-tabs-window-item value="2">
      <ProgList :progs="watchedProgs" :readonly="readonly"></ProgList>
    </v-tabs-window-item>
    <v-tabs-window-item value="3">
      <ProgList :progs="futureProgs" :readonly="readonly"></ProgList>
    </v-tabs-window-item>
  </v-tabs-window>
</template>
