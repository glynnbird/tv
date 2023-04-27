<script setup>
  // composables
  const progList = useProgList()
  const alert = useAlert()
  const auth = useAuth()

  // config
  const config = useRuntimeConfig()

  // local page items
  const title = ref(0)
  title.value = ''
  const network = ref(1)
  network.value = ''
  const date = ref(2)
  date.value = new Date().toISOString()
  const format = ref(3)
  format.value = ''
  const notes = ref(4)
  notes.value = ''
  const busy = ref(5)
  busy.value = false
  
  // method - add new todo 
  async function addProg() {
    if (!title.value) {
      return
    }
    busy.value = true
    const t = {
      t: title.value,
      n: network.value,
      d: date.value,
      f: format.value,
      notes: notes.value
    }
    console.log('API', '/add', t)
    const ret = await useFetch(`${config.public['apiBase']}/add`, {
      method: 'post',
      body: t,
      headers: {
        'content-type': 'application/json',
        apikey: auth.value.apiKey
      }
    })
    t.id = ret.data.value.id
    progList.value.push(t)

    // create alert
    alert.value.ts = new Date().getTime()
    alert.value.message = 'Added new tv programme'
    busy.value = false 

    // bounce to home page
    await navigateTo('/')
  }
</script>
<template>
  <PageTitle title="Add TV Programme"></PageTitle>
  <v-form>
    <v-text-field
      v-model="title"
      label="Title"
      required
      autofocus
    ></v-text-field>

    <v-select label="Network" v-model="network" :items="['', 'BBC', 'ITV', 'Netflix', 'Amazon', 'Apple', 'Disney']"></v-select>

    <v-text-field v-model="date" label="Date"></v-text-field>

    <v-select label="Format" v-model="format" :items="['', 'Series', 'Movie']"></v-select>

    <v-text-field
      v-model="notes"
      label="Notes"
    ></v-text-field>

    <v-btn
      :disabled="title.length === 0 || busy"
      color="success"
      class="mr-4"
      @click="addProg()">Add</v-btn>
  </v-form>
</template>
