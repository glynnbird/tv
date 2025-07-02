<script setup>

  // composables
  const { getProgFromAPI } = useProgsList()
  const route = useRoute()
  const id = route.params.id

  // the tv prog
  const prog = ref({})

  // if we have an id
  if (id) {
    try {
      prog.value = await getProgFromAPI(id)
      prog.value.date = new Date(prog.value.date)
    } catch (e) {
      console.error('failed to fetch prog', e)
    }
  }

</script>
<template>
  <ProgCard :prog="prog" showActions="true"></ProgCard>
</template>
