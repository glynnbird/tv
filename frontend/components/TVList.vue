<script setup>
  // input attributes
  const { list } = defineProps(['list'])

  // emitted events
  defineEmits(['delete'])
</script>
<template>
  <v-list v-if="list.length > 0">
    <v-list-item v-for="prog in list" :key="prog.id">
      <v-list-item-title>{{  prog.t }}</v-list-item-title>
      <v-list-item-subtitle v-if="prog.n">{{ prog.n }}</v-list-item-subtitle>
      <template v-slot:append>
        <v-btn
          color="grey-lighten-1"
          icon="mdi-delete"
          variant="text"
          @click="$emit('delete', prog.id)"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
  <!-- if empty, show instructions -->
  <div v-if="list.length === 0">
    Your TV list is empty. Start by clicking the <NuxtLink href="/add">+</NuxtLink> icon in the top left.
  </div>
</template>