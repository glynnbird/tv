<script setup>
  // composables
  const progList = useProgList()
  const auth = useAuth()

  // config
  const config = useRuntimeConfig()

  // if this is the first time,
  if (progList.value.length === 0) {
    try {
      //  fetch the list from the API
      console.log('API', '/list')
      const r = await useFetch(`${config.public['apiBase']}/list`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      progList.value = r.data.value.list
    } catch (e) {
      console.error('failed to fetch list of tv progs', e)
    }
  }
    
  // delete an individual todo
  const deleteProg = async  (id) => {
    console.log('API', '/delete', id)
    try {
      const ret = await useFetch(`${config.public['apiBase']}/delete`, {
        method: 'post',
        body: {
          id
        },
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      for (let i = 0; i < progList.value.length; i++) {
        if (progList.value[i].id === id) {
          progList.value.splice(i,1)
          break
        }
      }
    } catch (e) {
      console.error('Could not delete', id, e)
    }
  }
</script>
<template>
  <TVList :list="progList" @delete="deleteProg"></TVList>
</template>
