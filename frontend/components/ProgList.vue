<script setup>
  // input attributes
  const { progs } = defineProps(['progs'])

  // local page items
  const now = ref(0)
  now.value = new Date().toISOString()

  const nextWeek = ref(1)
  const ts = new Date().getTime() + 1000 * 60 * 60 * 24 * 7
  nextWeek.value = new Date(ts).toISOString().substring(0,10)

</script>
<template>
  <v-list>
    <v-list-item v-for="prog in progs" :key="prog.id" :to="`/prog/${prog.id}`">
      <v-list-item-title>{{  prog.title }} <v-chip v-if="prog.on" label size="x-small">{{ prog.on }}</v-chip></v-list-item-title>
      <v-list-item-subtitle>{{ prog.date }}
        <v-chip label size="x-small" color="primary" v-if="prog.watching">Watching</v-chip>
        <v-chip label size="x-small" color="secondary" v-if="prog.date>now">Future</v-chip>
        <v-chip label size="x-small" color="warning" v-if="prog.date > now && prog.date < nextWeek">This Week</v-chip>
      </v-list-item-subtitle>
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
