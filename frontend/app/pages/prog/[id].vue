<script setup>

// composables
const { getProgFromAPI, emptyProg, locateIndex, progs } = useProgsList()
const { set } = useSingleProgCache()
const route = useRoute()
const id = route.params.id

// the tv prog
const prog = ref({})

// if we have an id
if (id) {
  try {
    // quick load from prog list
    const i = locateIndex(id)
    console.log('located index', i)
    if (id) {
      prog.value = emptyProg()
      Object.assign(prog.value, progs.value[i])
    }

    // load the full prog in the background
    setTimeout(async () => {
      prog.value = await getProgFromAPI(id)
      prog.value.date = new Date(prog.value.date)
      set(id, prog.value)
    }, 1)

  } catch (e) {
    console.error('failed to fetch prog', e)
  }
}
</script>
<template>
  <ProgCard :prog="prog" showActions="true"></ProgCard>
</template>
