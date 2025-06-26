<script setup>
  // composables
  const progs = useProgs()
  const alert = useAlert()
  const auth = useAuth()
  const channels = ['BBC', 'ITV', 'Channel4', 'Channel5', 'Netflix', 'AppleTV', 'Disney', 'Amazon', 'SkyAtlantic', 'Alba', 'Paramount']
  const types = ['Series', 'Film', 'Single']
  const stick = useStick()
  const route = useRoute()
  const id = route.params.id

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // local page items
  const prog = ref({})

  // add busy flag
  const busy = ref(false)

  // whether to show the date picker
  const isPicking = ref(false)

  function showpicker() {
    isPicking.value = true;
  }

  // delete an individual item
  const deleteItem = async  () => {
    console.log('API', '/del', id)
    try {
      const ret = await $fetch(`${apiHome}/api/del`, {
        method: 'post',
        body: {
          id
        },
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      for (let i = 0; i < progs.value.length; i++) {
        if (progs.value[i].id === id) {
          progs.value.splice(i,1)
          break
        }
      }
      stick.value = true
      await navigateTo(`/`)
    } catch (e) {
      console.error('Could not delete', id, e)
    }
  }

  // method - edit programme
  async function edit() {
    if (!prog.value.title) {
      return
    }
    busy.value = true
    const t = JSON.parse(JSON.stringify(prog.value))
    t.date = prog.value.date.toISOString().substring(0, 10)
    t.stars = prog.value.stars.split(',').map(function(s) { return s.trim() })
    t.ts = Math.floor(new Date().getTime() / 1000)
    console.log('API', '/add', t)
    const ret = await $fetch(`${apiHome}/api/add`, {
      method: 'post',
      body: t,
      headers: {
        'content-type': 'application/json',
        apikey: auth.value.apiKey
      }
    })

    // edit the in-memory copy "progs"
    for(let i = 0; i < progs.value.length; i++) {
      const p = progs.value[i]
      if (p.id === id) {
        progs.value[i] = t
        break
      }
    }

    // create alert
    alert.value.ts = new Date().getTime()
    alert.value.message = 'Edited programme'
    busy.value = false

    // bounce to home page
    stick.value = true
    await navigateTo('/')
  }

  // if this is the first time,
  if (id) {
    try {
      //  fetch the list from the API
      console.log('API', '/get', `${apiHome}/api/get`)
      const r = await $fetch(`${apiHome}/api/get`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        },
        body: { id }
      })
      prog.value = r.doc
      prog.value.stars = prog.value.stars.filter((x) => {
        // only keep strings with something in
        return x.trim().length > 0
      })
      prog.value.stars = prog.value.stars.join(',')
      prog.value.date = new Date(prog.value.date)
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
  <v-btn color="error" variant="flat" @click="deleteItem()">Delete</v-btn>
</template>
