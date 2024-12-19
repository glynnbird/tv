<script setup>
  // input attributes
  const { progs, heading } = defineProps(['progs', 'heading'])

  // local page items
  const now = ref(0)
  now.value = new Date().toISOString()

  const nextWeek = ref(1)
  const ts = new Date().getTime() + 1000 * 60 * 60 * 24 * 7
  nextWeek.value = new Date(ts).toISOString().substring(0,10)

  const channels = ref(2)
  channels.value = ['BBC','ITV','Channel4','Channel5','SkyAtlantic','Alba']
</script>
<style>
.sep {
  margin-right:5px;
}
.cardsep {
  margin-bottom:20px; 
}
</style>
<template>
  <h4 style="user-select:none;">{{ heading }}</h4>
  <v-card class="cardsep" v-for="prog in progs" :key="prog.id" :to="`/prog/${prog.id}`">
    <v-img height="300" cover :src="`https://tv.glynnbird.com/api/img?id=${prog.id}`" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)">
      <v-card-title class="text-white">
        {{  prog.title }}
        <v-chip class="sep" v-if="prog.on" label size="x-small">{{ prog.on }}</v-chip>
        <v-chip class="sep" label size="x-small" v-if="prog.uptoep && prog.uptomax">{{ prog.uptoep }} / {{ prog.uptomax }}</v-chip>
        <v-chip class="sep" label size="x-small" v-if="prog.type==='Film' || prog.type=='Single'">{{ prog.type }}</v-chip>
      </v-card-title>
      <v-card-subtitle>
        <v-chip class="sep" variant="flat" size="x-small" color="secondary" v-if="prog.date > now">{{ prog.date }}</v-chip>
        <v-icon class="sep" size="x-small" color="red" v-if="prog.date > now && prog.date < nextWeek && channels.includes(prog.on)">mdi-record</v-icon>
      </v-card-subtitle>
    </v-img>
  </v-card>

  <!-- if empty, show instructions -->
  <div v-if="progs.length === 0">
    Your list is empty. Start by clicking the <NuxtLink href="/add">+</NuxtLink> icon in the top left.
  </div>
</template>
