<script setup>
  // input attributes
  const { progs } = defineProps(['progs'])

  // emitted events
  //defineEmits(['deleteItem'])
</script>
<template>
  <v-list>
    <v-list-item v-for="prog in progs" :key="prog.id" :href="`/prog/${prog.id}`">
      <v-list-item-title>{{  prog.title }}</v-list-item-title>
      <v-list-item-subtitle v-if="prog.date">{{ prog.date }}</v-list-item-subtitle>
    </v-list-item>
  </v-list>
  <!-- if empty, show instructions -->
  <div v-if="progs.length === 0">
    Your list is empty. Start by clicking the <NuxtLink href="/add">+</NuxtLink> icon in the top left.
  </div>
</template>
