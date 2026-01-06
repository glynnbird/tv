<script setup>
const { plusOne, toggle, deleteProg, getImageURL } = useProgsList()
const { prog } = defineProps(['prog', 'showActions'])

// local page items
const now = ref(new Date().toISOString())
const ts = new Date().getTime() + 1000 * 60 * 60 * 24 * 7
const nextWeek = ref(new Date(ts).toISOString().substring(0, 10))
const channels = ref(['BBC', 'ITV', 'Channel4', 'Channel5', 'SkyAtlantic', 'Alba', 'U'])

async function delProg(id) {
  await deleteProg(id)
  await navigateTo('/')
}
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
  <v-card class="cardsep" :key="prog.id" :to="`/prog/${prog.id}`">
    <v-img cover eager transition="false" min-height="200"
      :src="getImageURL(prog)" class="progimg">
      <v-card-title class="text-white shadow">
        {{ prog.title }}
        <v-chip v-if="prog.season" label color="white">{{ prog.season }}</v-chip>
      </v-card-title>
      <v-card-subtitle class="position-absolute bottom-0 left-0 offbot" style="width: 100%">
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
        <v-chip class="sep" variant="flat" label size="default" color="white" v-if="prog.date.toISOString() > now">
          <HumanDate :date="prog.date" />
          <v-icon class="sep" size="default" color="red"
            v-if="prog.date.toISOString() > now && prog.date.toISOString() < nextWeek && channels.includes(prog.on)">mdi-record</v-icon>
        </v-chip>
        <v-progress-linear class="cardsep" height="15" color="red-lighten-2"
          v-if="prog.watching && prog.type === 'Series'" :model-value="prog.uptoep" :max="prog.uptomax">
          <span class="percent">{{ Math.ceil(100 * prog.uptoep / prog.uptomax) }}%</span>
        </v-progress-linear>
      </v-card-subtitle>
    </v-img>
    <v-card-text v-if="showActions == 'true'">
      <p>{{ prog.description }}</p>
      <v-chip-group v-if="prog.stars && prog.stars.length > 0">
        <v-chip v-for="star in prog.stars" :key="star">
          {{ star }}
        </v-chip>
      </v-chip-group>
      <v-table density="comfortable">
        <tbody>
          <tr>
            <th>Date</th>
            <td>
              <HumanDate :date="prog.date" showYear="true" />
            </td>
          </tr>
          <tr v-if="prog.type">
            <th>Type</th>
            <td>{{ prog.type }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-actions v-if="showActions == 'true'">
      <v-btn color="primary" variant="flat" @click="toggle(prog.id)">
        <span v-if="!prog.watching">Watch</span>
        <span v-if="prog.watching">Unwatch</span>
      </v-btn>
      <v-btn v-if="prog.watching && prog.type == 'Series'" color="secondary" variant="flat"
        @click="plusOne(prog)">+1</v-btn>
      <v-btn color="warning" variant="flat" :to="`/edit/${prog.id}`">Edit</v-btn>
    </v-card-actions>
  </v-card>
  <div class="pod" v-if="showActions == 'true' && prog.watching">
    <v-btn color="error" variant="flat" @click="delProg(prog.id)">Delete</v-btn>
  </div>
</template>
