<script setup>
  // composables
  const query = useRoute().query
  const progs = useProgs()
  const auth = useAuth()

  // set manifest header
  useHead({
    link: [
      { rel: 'manifest', href: '/manifest.json' }
    ]
  })

  // config
  const config = useRuntimeConfig()
  const apiHome = config.public['apiBase'] || window.location.origin

  // if this is the first time,
  if (!query.stick && progs.value.length === 0) {
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

  function compareFn(a, b) {
    if (a.date < b.date) {
      return -1;
    } else if (a.date > b.date) {
      return 1;
    }
    return 0;
  }

  // sort into date order
  if (progs.value.length > 0) {
    progs.value.sort(compareFn)
  }

</script>
<template>
  <PageTitle title="TV List"></PageTitle>
  <ProgList :progs="progs"></ProgList>
</template>

