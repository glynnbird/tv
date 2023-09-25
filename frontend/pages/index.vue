<script setup>
  // composables
  const progs = useProgs()
  const auth = useAuth()

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // if this is the first time,
  if (progs.value.length === 0) {
    try {
      //  fetch the list from the API
      console.log('API', '/list', `${apiHome}/api/list`)
      const r = await useFetch(`${apiHome}/api/list`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      progs.value = r.data.value.list
    } catch (e) {
      console.error('failed to fetch list of progs', e)
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
    } catch (e) {
      console.error('Could not delete', id, e)
    }
  }
</script>
<template>
  <PageTitle title="TV List"></PageTitle>
  <ProgList :progs="progs" @deleteItem="deleteItem"></ProgList>
</template>
