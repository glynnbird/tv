<script setup>
  // composables
  const progs = useProgs()
  const route = useRoute()
  const id = route.params.id
  const auth = useAuth()
  const stick = useStick()

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // the tv prog
  const prog = ref(0)
  prog.value = {}

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
    } catch (e) {
      console.error('failed to fetch prog', e)
    }
  }

  // delete an individual item
  const deleteItem = async  (id) => {
    console.log('API', '/del', id)
    try {
      const ret = await useFetch(`${apiHome}/api/del`, {
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

  // delete an individual item
  const toggle = async  (id) => {
    console.log('API', '/toggle', id)
    try {
      const ret = await useFetch(`${apiHome}/api/toggle`, {
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
          progs.value[i].watching = !progs.value[i].watching
          break
        }
      }
      stick.value = true
      await navigateTo(`/`)
    } catch (e) {
      console.error('Could not toggle', id, e)
    }
  }
</script>
<template>
  <v-card v-if="prog">
    <v-img v-if="prog.pic" :src="prog.pic" cover></v-img>
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
          <tr><th>Date</th><td>{{ prog.date }}</td></tr>
          <tr><th>On</th><td>{{ prog.on }}</td></tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" variant="flat" @click="toggle(prog.id)">
        <span v-if="!prog.watching">Watch</span>
        <span v-if="prog.watching">Unwatch</span>
      </v-btn>
    </v-card-actions>
    
    <v-expansion-panels color="red-lighten-5">
      <v-expansion-panel title="Delete" text="Careful: once deleted, data cannot be recovered">
        <v-expansion-panel-text>
          <v-btn color="error" variant="flat" @click="deleteItem(prog.id)">Delete</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    
  </v-card>
</template>
