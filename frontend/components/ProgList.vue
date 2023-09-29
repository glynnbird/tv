<script setup>
  // input attributes
  const { progs } = defineProps(['progs'])

  // emitted events
  //defineEmits(['deleteItem'])
</script>
<template>
  <v-list>
    <v-list-item v-for="prog in progs" :key="prog.id" :to="`/prog/${prog.id}`">
      <v-list-item-title>{{  prog.title }}</v-list-item-title>
      <v-list-item-subtitle>{{ prog.date }} <v-chip label size="x-small" color="primary" v-if="prog.watching">Watching</v-chip></v-list-item-subtitle>
      <template v-slot:append>
        <v-btn
          color="grey-lighten-1"
          icon="mdi-chevron-right"
          variant="text"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
  <!-- if empty, show instructions -->
  <div v-if="progs.length === 0">
    Your list is empty. Start by clicking the <NuxtLink href="/add">+</NuxtLink> icon in the top left.
  </div>
</template>
