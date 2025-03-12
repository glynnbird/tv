<script setup>
  // input attributes
  const { progs, heading } = defineProps(['progs', 'heading'])

  // local page items
  const now = ref(new Date().toISOString())
  const ts = new Date().getTime() + 1000 * 60 * 60 * 24 * 7
  const nextWeek = ref(new Date(ts).toISOString().substring(0,10))
  const channels = ref(['BBC','ITV','Channel4','Channel5','SkyAtlantic','Alba','U'])
</script>
<style>
.sep {
  margin-right:10px;
}
.cardsep {
  margin-top: 10px;
  margin-bottom:10px; 
}
.shadow {
  text-shadow: 1px 1px 1px rgba(0,0,0, 1);
}
.offbot {
  margin-bottom: 10px;
}
.percent {
  color: white;
  font-size: 12px;
  font-weight: bold;
}
</style>
<template>
  <v-card class="cardsep" v-for="prog in progs" :key="prog.id" :to="`/prog/${prog.id}`">
    <v-img height="250" cover eager :src="`https://tv.glynnbird.com/api/img?id=${prog.id}`">
      <v-card-title class="text-white shadow">{{  prog.title }}</v-card-title>
      <v-card-subtitle class="position-absolute bottom-0 left-0 offbot" style="width: 100%">
        <v-chip class="sep" v-if="prog.on" variant="flat" color="grey-lighten-2" label size="default">
          {{ prog.on }}
        </v-chip>
        <v-chip class="sep" variant="flat" label size="default" color="grey-lighten-2" v-if="prog.type==='Series' && prog.uptoep && prog.uptomax">
          {{ prog.uptoep }} / {{ prog.uptomax }}
        </v-chip>
        <v-chip class="sep" variant="flat" label size="default" color="grey-lighten-2" v-if="prog.type==='Film' || prog.type=='Single'">
          {{ prog.type }}
        </v-chip>
        <v-chip class="sep" variant="flat" label size="default" color="white" v-if="prog.date > now">
          <HumanDate :date="prog.date" />
          <v-icon class="sep" size="default" color="red" v-if="prog.date > now && prog.date < nextWeek && channels.includes(prog.on)">mdi-record</v-icon>
        </v-chip>
        <v-progress-linear class="cardsep" height="15" color="red-lighten-2" v-if="prog.watching && prog.type==='Series'" :model-value="prog.uptoep" :max="prog.uptomax">
          <span class="percent">{{ Math.ceil(100 * prog.uptoep/prog.uptomax) }}%</span>
        </v-progress-linear>
      </v-card-subtitle>
    </v-img>
  </v-card>

  <!-- if empty, show instructions -->
  <div v-if="progs.length === 0">
    Your list is empty. Start by clicking the <NuxtLink href="/add">+</NuxtLink> icon in the top left.
  </div>
</template>
