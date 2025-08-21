<script setup>
const { prog } = defineProps(['prog'])
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
</style>
<template>
  <v-card class="cardsep" :key="prog.id" :to="`/prog/${prog.id}`">
    <v-card-title>
      {{ prog.title }}
      <v-chip v-if="prog.season" label color="white">{{ prog.season }}</v-chip>
    </v-card-title>
    <v-card-text>
      <v-chip class="sep" v-if="prog.on" variant="flat" color="grey-lighten-2" label size="default">
        {{ prog.on }}
      </v-chip>
      <v-chip class="sep" variant="flat" label size="default" color="grey-lighten-2"
        v-if="prog.type === 'Series' && prog.uptoep && prog.uptomax">
        {{ prog.uptoep }} / {{ prog.uptomax }}
      </v-chip>
      <v-chip class="sep" variant="flat" label size="default" color="grey-lighten-2"
        v-if="prog.type === 'Film' || prog.type == 'Single'">
        {{ prog.type }}
      </v-chip>
      <v-chip class="sep" variant="flat" label size="default" color="white">
        <HumanDate :date="prog.date" />
      </v-chip>
      <v-progress-linear class="cardsep" height="15" color="red-lighten-2"
        v-if="prog.watching && prog.type === 'Series'" :model-value="prog.uptoep" :max="prog.uptomax">
        <span class="percent">{{ Math.ceil(100 * prog.uptoep / prog.uptomax) }}%</span>
      </v-progress-linear>
    </v-card-text>
  </v-card>
</template>
