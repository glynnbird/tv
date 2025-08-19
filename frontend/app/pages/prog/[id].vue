<script setup>

// composables
const { getProgFromAPI, emptyProg, locateIndex, progs } = useProgsList()
const { get, set } = useSingleProgCache()
const route = useRoute()
const id = route.params.id

// the tv prog
const prog = ref({})

// if we have an id
if (id) {
  try {
    // if the programme is in the prog cache, use it
    const p = get(id)
    if (p) {
      prog.value = p
    } else {
      // otherwise do a first quick load from prog list
      const i = locateIndex(id)
      console.log('located index', i)
      if (id) {
        prog.value = emptyProg()
        Object.assign(prog.value, progs.value[i])
      }

      // then load the full prog in the background
      setTimeout(async () => {
        prog.value = await getProgFromAPI(id)
        prog.value.date = new Date(prog.value.date)
        set(id, prog.value)
      }, 1)
    }
  } catch (e) {
    console.error('failed to fetch prog', e)
  }
}
</script>
<template>
  <ProgCard :prog="prog" showActions="true"></ProgCard>
</template>
