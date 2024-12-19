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
.shadow {
  text-shadow:
        0.07em 0 #666,
        0 0.07em #666,
        -0.07em 0 #666,
        0 -0.07em #666;
}
</style>
<template>
  <h4 style="user-select:none;">{{ heading }}</h4>
  <v-card class="cardsep" v-for="prog in progs" :key="prog.id" :to="`/prog/${prog.id}`">
    <v-img height="300" cover :src="`https://tv.glynnbird.com/api/img?id=${prog.id}`">
      <v-card-title class="text-white" style="">
        <span class="shadow sep">{{  prog.title }}</span>
        <v-chip class="sep" v-if="prog.on" variant="flat" color="grey-lighten-2" label size="x-small">{{ prog.on }}</v-chip>
        <v-chip class="sep" variant="flat" label size="x-small" color="grey-lighten-2" v-if="prog.uptoep && prog.uptomax">{{ prog.uptoep }} / {{ prog.uptomax }}</v-chip>
        <v-chip class="sep" variant="flat" label size="x-small" color="grey-lighten-2" v-if="prog.type==='Film' || prog.type=='Single'">{{ prog.type }}</v-chip>
      </v-card-title>
      <v-card-subtitle>
        <v-chip class="sep" variant="flat" label size="x-small" color="primary" v-if="prog.date > now">
          {{ prog.date }}
          <v-icon class="sep" size="x-small" color="red" v-if="prog.date > now && prog.date < nextWeek && channels.includes(prog.on)">mdi-record</v-icon>
        </v-chip>
      </v-card-subtitle>
    </v-img>
  </v-card>

  <!-- if empty, show instructions -->
  <div v-if="progs.length === 0">
    Your list is empty. Start by clicking the <NuxtLink href="/add">+</NuxtLink> icon in the top left.
  </div>
</template>
