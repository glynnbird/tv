<script setup>
  // composables
  const { getProgFromAPI, addProg, deleteProg } = useProgsList()
  const channels = ['BBC', 'ITV', 'Channel4', 'Channel5', 'Netflix', 'AppleTV', 'Disney', 'Amazon', 'SkyAtlantic', 'Alba', 'Paramount']
  const types = ['Series', 'Film', 'Single']
  const route = useRoute()
  const id = route.params.id

  // local page items
  const prog = ref({})

  // add busy flag
  const busy = ref(false)

  // whether to show the date picker
  const isPicking = ref(false)

  function showpicker() {
    isPicking.value = true;
  }

  // method - edit programme
  async function edit() {
    if (!prog.value.title) {
      return
    }
    busy.value = true
    const t = JSON.parse(JSON.stringify(prog.value))
    await addProg(t, false)
    busy.value = false

    // bounce to home page
    await navigateTo('/')
  }

  // if this is the first time,
  if (id) {
    try {
      prog.value = await getProgFromAPI(id)
    } catch (e) {
      console.error('failed to fetch prog', e)
    }
  }
</script>
<style>
.divider {
  margin-top:25px;
  margin-bottom: 25px;
}
</style>
<template>
  <PageTitle title="Edit"></PageTitle>
  <v-form>
    <v-text-field v-model="prog.title" label="Title" required autofocus></v-text-field>

    <v-textarea v-model="prog.description" label="Description"></v-textarea>

    <v-text-field v-model="prog.stars" label="Stars"></v-text-field>

    <v-select v-model="prog.on" label="On (Channel)" :items="channels">
    </v-select>

    <v-select v-model="prog.type" label="Type" :items="types">
    </v-select>

    <v-text-field
      v-if="prog.type === 'Series'"
      v-model="prog.uptoep"
      label="Episodes Watched"
      clearable
      ></v-text-field>

    <v-text-field
      v-if="prog.type === 'Series'"
      v-model="prog.uptomax"
      label="Episodes Total"
      clearable
      ></v-text-field>

    <v-row>
      <v-col>
        <v-text-field v-model="prog.date" label="Date" readonly></v-text-field>
      </v-col>
      <v-col>
        <v-btn @click="showpicker">Change</v-btn>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-date-picker v-model="prog.date" v-if="isPicking" elevation="24"
        @update:modelValue="isPicking = false"></v-date-picker>
    </v-row>

    <v-text-field v-model="prog.season" label="Season" @keydown.enter="add()"></v-text-field>

    <v-text-field v-model="prog.pic" label="Pic" @keydown.enter="add()" clearable></v-text-field>

    <v-checkbox label="Watching" v-model="prog.watching"></v-checkbox>

    <v-btn :disabled="prog.title.length === 0 || busy" color="warning" class="mr-4" @click="edit()">
      edit
    </v-btn>
  </v-form>
  <hr class="divider" />
  <v-btn color="error" variant="flat" @click="deleteProg(prog.id); navigateTo('/')">Delete</v-btn>
</template>
