<script setup>
const { tab } = useTab()
const { target } = defineProps({ target: String })

const { availableProgs, watchedProgs, futureProgs } = useProgsList()
</script>
<template>
  <!-- Tab navigation-->
  <v-container>
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab value="1" @click="navigateTo(target)">
        Ready
        <v-badge color="primary" :content="availableProgs.length" inline></v-badge>
      </v-tab>
      <v-tab value="2" @click="navigateTo(target)">
        Now
        <v-badge color="green" :content="watchedProgs.length" inline></v-badge>
      </v-tab>
      <v-tab value="3" @click="navigateTo(target)">
        Future
        <v-badge color="red" :content="futureProgs.length" inline></v-badge>
      </v-tab>
    </v-tabs>
  </v-container>
</template>
