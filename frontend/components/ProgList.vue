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
</style>
<template>
  <v-list>
    <v-list-subheader style="user-select:none;">{{ heading }}</v-list-subheader>
    <v-list-item v-for="prog in progs" :key="prog.id" :to="`/prog/${prog.id}`">
      <v-list-item-title>{{  prog.title }}</v-list-item-title>
      <v-list-item-subtitle>
        <v-chip class="sep" v-if="prog.on" label size="x-small">{{ prog.on }}</v-chip>
        <v-chip class="sep" color="primary" label size="x-small" v-if="prog.uptoep && prog.uptomax">{{ prog.uptoep }} / {{ prog.uptomax }}</v-chip>
        <v-chip class="sep" color="primary" label size="x-small" v-if="prog.type==='Film' || prog.type=='Single'">{{ prog.type }}</v-chip>
        <v-icon class="sep" size="x-small" color="red" v-if="prog.date > now && prog.date < nextWeek && channels.includes(prog.on)">mdi-record</v-icon>
        <v-chip class="sep" variant="flat" size="x-small" color="secondary" v-if="prog.date > now">{{ prog.date }}</v-chip>
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
