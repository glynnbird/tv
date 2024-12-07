<script setup>
  // composables
  const progs = useProgs()
  const alert = useAlert()
  const auth = useAuth()
  const channels = ['BBC','ITV','Channel4','Channel5','Netflix','AppleTV','Disney','Amazon','SkyAtlantic','Alba','Paramount']
  const types = ['Series', 'Film', 'Single']
  const stick = useStick()

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // local page items
  const title = ref(0)
  title.value = ''
  const description = ref(1)
  description.value = ''
  const stars = ref(2)
  stars.value = ''
  const on = ref(3)
  on.value = ''
  const date = ref(4)
  date.value = new Date()
  const season = ref(5)
  season.value = ''
  const pic = ref(6)
  pic.value = ''
  const watching = ref(7)
  watching.value = false
  const type = ref(8)
  type.value = ''
  const uptoep = ref(11)
  uptoep.value = ''
  const uptomax = ref(12)
  uptomax.value = ''

  // add busy flag
  const busy = ref(9)
  busy.value = false

  // whether to show the date picker
  const isPicking = ref(10)
  isPicking.value = false

  function showpicker() {
    isPicking.value = true;
  }
  
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
      date: date.value.toISOString().substring(0, 10),
      season: season.value,
      pic: pic.value,
      watching: watching.value,
      stars: stars.value.split(',').map(function(s) { return s.trim() }),
      type: type.value,
      uptoep: uptoep.value,
      uptomax: uptomax.value
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
    stick.value = true
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

    <v-textarea
      v-model="description"
      label="Description"
    ></v-textarea>

    <v-text-field
      v-model="stars"
      label="Stars"
    ></v-text-field>

    <v-select v-model="on" label="On (Channel)" :items="channels">
    </v-select>

    <v-select v-model="type" label="Type" :items="types">
    </v-select>

    <v-text-field
      v-if="type === 'Series'"
      v-model="uptoep"
      label="Episodes Watched"
      ></v-text-field>

    <v-text-field
      v-if="type === 'Series'"
      v-model="uptomax"
      label="Episodes Total"
      ></v-text-field>

    <v-row>
      <v-col>
        <v-text-field
          v-model="date"
          label="Date"
          readonly
        ></v-text-field>
      </v-col>
      <v-col>
        <v-btn @click="showpicker">Change</v-btn>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-date-picker
        v-model="date"
        v-if="isPicking"
        elevation="24"
        @update:modelValue="isPicking = false"
      ></v-date-picker>
    </v-row>

    <v-text-field
      v-model="season"
      label="Season"
    ></v-text-field>

    <v-text-field
      v-model="pic"
      label="Pic"
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
