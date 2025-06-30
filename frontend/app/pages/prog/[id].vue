<script setup>

  // composables
  const { getProgFromAPI, plusOne, toggle, deleteProg } = useProgsList()
  const route = useRoute()
  const id = route.params.id

  // the tv prog
  const prog = ref({})

  // if we have an id
  if (id) {
    try {
      prog.value = await getProgFromAPI(id)
    } catch (e) {
      console.error('failed to fetch prog', e)
    }
  }

  // edit programme
  const editItem = async (id) => {
    await navigateTo(`/edit/${id}`)
  }

</script>
<style>
.pod {
  margin-top:20px;
}
</style>
<template>
  <v-card v-if="prog">
    <v-img v-if="prog.pic" :src="prog.pic" cover max-height="500"></v-img>
    <v-card-title>{{ prog.title }}</v-card-title>
    <v-card-subtitle v-if="prog.season">Season {{ prog.season }}</v-card-subtitle>
    <v-card-text>
      <p>{{  prog.description }}</p>
      <v-chip-group v-if="prog.stars.length > 0">
        <v-chip v-for="star in prog.stars" :key="star">
          {{ star }}
        </v-chip>
      </v-chip-group>
      <v-table density="comfortable">
        <tbody>
          <tr><th>Date</th><td><HumanDate :date="prog.date" showYear="true" /></td></tr>
          <tr><th>On</th><td>{{ prog.on }}</td></tr>
          <tr v-if="prog.type"><th>Type</th><td>{{ prog.type }}</td></tr>
          <tr v-if="prog.type === 'Series' && prog.uptoep && prog.uptomax"><th>Episodes</th><td>{{ prog.uptoep }} / {{ prog.uptomax }}</td></tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" variant="flat" @click="toggle(prog.id); prog.watching = !prog.watching">
        <span v-if="!prog.watching">Watch</span>
        <span v-if="prog.watching">Unwatch</span>
      </v-btn>
      <v-btn v-if="prog.watching && prog.type=='Series'" color="secondary" variant="flat" @click="plusOne(prog.id)">+1</v-btn>
      <v-btn color="warning" variant="flat" @click="editItem(prog.id)">Edit</v-btn>
    </v-card-actions>
  </v-card>
    
  <div class="pod" v-if="prog.watching">
    <v-btn color="error" variant="flat" @click="deleteProg(prog.id); navigateTo('/')">Delete</v-btn>
  </div>
</template>
