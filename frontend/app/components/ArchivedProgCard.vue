<script setup>
const { prog } = defineProps(['prog'])
const { getImageURL } = useProgsList()
</script>
<style>
.sep {
  margin-right: 10px;
}

.cardsep {
  margin-top: 10px;
  margin-bottom: 10px;
}

.shadow {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 1);
}

.offbot {
  margin-bottom: 10px;
}

.percent {
  color: white;
  font-size: 12px;
  font-weight: bold;
}
.progimg {
  background-color: #eee;
}
</style>
<template>
  <v-card class="cardsep" :key="prog.id">
    <v-img cover transition="false" min-height="200" :src="getImageURL(prog, true)" class="progimg">
      <v-card-title class="text-white shadow">
        {{ prog.title }}
        <v-chip v-if="prog.season" label color="white">{{ prog.season }}</v-chip>
      </v-card-title>
    </v-img>
  </v-card>
</template>
