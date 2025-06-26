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
  const aiurl = ref('')
  const doc = ref({
    title: '',
    description: '',
    stars: '',
    on: '',
    date: new Date(),
    pic: '', 
    watching: false,
    type: '',
    uptoep: '0',
    uptomax: '6',
    season: ''
  })
  // const title = ref('')
  // const description = ref('')
  // const stars = ref('')
  // const on = ref('')
  // const date = ref(new Date())
  // const pic = ref('')
  // const watching = ref(false)
  // const type = ref('')
  // const uptoep = ref('0')
  // const uptomax = ref('6')
  // const season = ref('')

  // add busy flag
  const busy = ref(false)

  // whether to show the date picker
  const isPicking = ref(false)

  function showpicker() {
    isPicking.value = true;
  }
  
  async function prefill() {
    busy.value = true
    console.log('API', '/ai')
    const ret = await $fetch(`${apiHome}/api/ai`, {
      method: 'post',
      body: {
        url: aiurl.value
      },
      headers: {
        'content-type': 'application/json',
        apikey: auth.value.apiKey
      }
    })
    console.log('ai response', ret)
    if (ret && ret.ok === true) {
      const ai = ret.response
      console.log('ai', ai)
      Object.assign(doc.value, ai)
      doc.value.stars = ai.stars.join(',')
      doc.value.date = new Date(ai.date)
      busy.value = false
    } else {
      alert.value.ts = new Date().getTime()
      alert.value.message = 'No useful prefill data found'
      busy.value = false
    }
  }

  // method - add new todo 
  async function add() {
    if (!doc.value.title) {
      return
    }
    busy.value = true
    const t = JSON.parse(JSON.stringify(doc.value))
    t.date = doc.value.date.toISOString().substring(0, 10)
    t.stars = doc.value.stars.split(',').map(function(s) { return s.trim() })
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
    t.id = ret.id
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
<style>
.ai {
  margin-bottom: 20px;  
}
</style>
<template>
  <v-progress-linear
    v-if="busy"
    color="#BBDEFB"
    indeterminate
  ></v-progress-linear>
  <PageTitle title="Add"></PageTitle>

  <v-alert title="AI Assistant" color="blue-lighten-4" class="ai">
    <v-form class="ai">
      <v-text-field
        v-model="aiurl"
        label="URL of a page about the programme"
      ></v-text-field>
      <v-btn
        :disabled="aiurl.length === 0 || busy"
        color="success"
        @click="prefill()"
      >
        <v-icon
          color="white"
          icon="mdi-auto-fix"
        ></v-icon>
      </v-btn>

    </v-form>
  </v-alert>

  <v-form>
    <v-text-field
      v-model="doc.title"
      label="Title"
      required
      autofocus
      @keydown.enter="add()"
    ></v-text-field>

    <v-textarea
      v-model="doc.description"
      label="Description"
    ></v-textarea>

    <v-text-field
      v-model="doc.stars"
      label="Stars"
    ></v-text-field>

    <v-select v-model="doc.on" label="On (Channel)" :items="channels">
    </v-select>

    <v-select v-model="doc.type" label="Type" :items="types">
    </v-select>

    <v-text-field
      v-if="doc.type === 'Series'"
      v-model="doc.uptoep"
      label="Episodes Watched"
      ></v-text-field>

    <v-text-field
      v-if="doc.type === 'Series'"
      v-model="doc.uptomax"
      label="Episodes Total"
      clearable
      ></v-text-field>

    <v-row>
      <v-col>
        <v-text-field
          v-model="doc.date"
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
        v-model="doc.date"
        v-if="isPicking"
        elevation="24"
        @update:modelValue="isPicking = false"
      ></v-date-picker>
    </v-row>

    <v-text-field
      v-model="doc.season"
      label="Season"
    ></v-text-field>

    <v-text-field
      v-model="doc.pic"
      label="Pic"
    ></v-text-field>

    <v-img v-if="doc.pic" :src="doc.pic"></v-img>

    <v-checkbox label="Watching" v-model="doc.watching"></v-checkbox>

    <v-btn
      :disabled="doc.title.length === 0 || busy"
      color="success"
      class="mr-4"
      @click="add()"
    >
      Add
    </v-btn>
  </v-form>
</template>
