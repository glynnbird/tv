<script setup>
  // composables
  const query = useRoute().query
  const progs = useProgs()
  const auth = useAuth()

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // if this is the first time,
  if (!query.deleted && progs.value.length === 0) {
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
</script>
<template>
  <PageTitle title="TV List"></PageTitle>
  <ProgList :progs="progs"></ProgList>
</template>
