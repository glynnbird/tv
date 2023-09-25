<script setup>
  // composables
  const progs = useProgs()
  const alert = useAlert()
  const auth = useAuth()
  const channels = ['BBC','ITV','Channel4','Netflix','AppleTV','Netflix','Disney']

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // local page items
  const title = ref(0)
  title.value = ''
  const description = ref(1)
  description.value = ''
  const on = ref(2)
  on.value = ''
  const date = ref(3)
  date.value = new Date().toISOString().substring(0, 10)
  const season = ref(4)
  season.value = ''
  const pic = ref(5)
  pic.value = ''
  const watching = ref(6)
  watching.value = false

  // add busy flag
  const busy = ref(7)
  busy.value = false
  
  // method - add new todo 
  async function add() {
    if (!title.value) {
      return
    }
    busy.value = true
    const t = {
      title: title.value,
      description: description.value,
      on: on.value,
      date: date.value,
      season: season.value,
      pic: pic.value,
      watching: watching.value
    }
    console.log('API', '/add', t)
    const ret = await useFetch(`${apiHome}/api/add`, {
      method: 'post',
      body: t,
      headers: {
        'content-type': 'application/json',
        apikey: auth.value.apiKey
      }
    })
    t.id = ret.data.value.id
    progs.value.push(t)

    // create alert
    alert.value.ts = new Date().getTime()
    alert.value.message = 'Added new programme'
    busy.value = false 

    // bounce to home page
    await navigateTo('/')
  }
</script>
<template>
  <PageTitle title="Add"></PageTitle>
  <v-form>
    <v-text-field
      v-model="title"
      label="Title"
      required
      autofocus
      @keydown.enter="add()"
    ></v-text-field>

    <v-text-field
      v-model="description"
      label="Description"
      @keydown.enter="add()"
    ></v-text-field>

    <v-select v-model="on" label="On (Channel)" :items="channels">
    </v-select>

    <v-text-field
      v-model="date"
      label="Date"
      @keydown.enter="add()"
    ></v-text-field>

    <v-text-field
      v-model="season"
      label="Season"
      @keydown.enter="add()"
    ></v-text-field>

    <v-text-field
      v-model="pic"
      label="Pic"
      @keydown.enter="add()"
    ></v-text-field>

    <v-checkbox label="Watching" v-model="watching"></v-checkbox>

    <v-btn
      :disabled="title.length === 0 || busy"
      color="success"
      class="mr-4"
      @click="add()"
    >
      Add
    </v-btn>
  </v-form>
</template>
