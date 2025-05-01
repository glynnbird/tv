<script setup>
  // composables
  const progs = useProgs()
  const alert = useAlert()
  const auth = useAuth()
  const channels = ['BBC','ITV','Channel4','Channel5','Netflix','AppleTV','Disney','Amazon','SkyAtlantic','Alba','Paramount','U']
  const types = ['Series', 'Film', 'Single']
  const stick = useStick()

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // local page items
  const title = ref('')
  const description = ref('')
  const stars = ref('')
  const on = ref('')
  const date = ref(new Date())
  const pic = ref('')
  const watching = ref(false)
  const type = ref('')
  const uptoep = ref('0')
  const uptomax = ref('6')
  const season = ref('')

  // add busy flag
  const busy = ref(false)

  // whether to show the date picker
  const isPicking = ref(false)

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
      uptomax: uptomax.value,
      ts:  Math.floor(new Date().getTime() / 1000)
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
      clearable
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
