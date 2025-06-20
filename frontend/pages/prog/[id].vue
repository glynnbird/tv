<script setup>

  // composables
  const progs = useProgs()
  const route = useRoute()
  const router = useRouter()
  const id = route.params.id
  const auth = useAuth()
  const stick = useStick()

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // the tv prog
  const prog = ref({})

  // if this is the first time,
  if (id) {
    try {
      //  fetch the list from the API
      console.log('API', '/get', `${apiHome}/api/get`)
      const r = await useFetch(`${apiHome}/api/get`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        },
        body: { id }
      })
      prog.value = r.data.value.doc
      prog.value.stars = prog.value.stars.filter((x) => {
        // only keep strings with something in
        return x.trim().length > 0
      })
    } catch (e) {
      console.error('failed to fetch prog', e)
    }
  }

  // add one to the progress count
  const plusOne = async (id) => {
    if (prog.value.type === 'Series') {
      console.log('incrementing')
      let upto = parseInt(prog.value.uptoep)
      prog.value.uptoep = (upto + 1).toString()
    } else {
      return
    }
    prog.value.ts =  Math.floor(new Date().getTime() / 1000)
    console.log('API', '/add', JSON.stringify(prog.value))
    const ret = await useFetch(`${apiHome}/api/add`, {
      method: 'post',
      body: prog.value,
      headers: {
        'content-type': 'application/json',
        apikey: auth.value.apiKey
      }
    })

    // edit the in-memory copy "progs"
    for(let i = 0; i < progs.value.length; i++) {
      const p = progs.value[i]
      if (p.id === id) {
        progs.value[i] = prog.value
        break
      }
    }
  }

  // edit programme
  const editItem = async (id) => {
    await navigateTo(`/edit/${id}`)
  }

  // delete an individual item
  const toggle = async  (id) => {
    console.log('API', '/toggle', id)
    try {
      const ret = await useFetch(`${apiHome}/api/toggle`, {
        method: 'post',
        body: {
          id,
          ts:  Math.floor(new Date().getTime() / 1000)
        },
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      for (let i = 0; i < progs.value.length; i++) {
        if (progs.value[i].id === id) {
          progs.value[i].watching = !progs.value[i].watching
          break
        }
      }
      stick.value = true
      await navigateTo(router.back())
    } catch (e) {
      console.error('Could not toggle', id, e)
    }
  }

</script>
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
      <v-btn color="primary" variant="flat" @click="toggle(prog.id)">
        <span v-if="!prog.watching">Watch</span>
        <span v-if="prog.watching">Unwatch</span>
      </v-btn>
      <v-btn v-if="prog.watching && prog.type=='Series'" color="secondary" variant="flat" @click="plusOne(prog.id)">+1</v-btn>
      <v-btn color="warning" variant="flat" @click="editItem(prog.id)">Edit</v-btn>
    </v-card-actions>

  </v-card>
</template>
