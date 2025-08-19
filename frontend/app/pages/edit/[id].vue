<script setup>
// composables
const { getProgFromAPI, addProg, deleteProg } = useProgsList()
const { get, clear } = useSingleProgCache()
const { busy } = useBusy()
const route = useRoute()
const id = route.params.id

// local page items
const prog = ref({})

// method - edit programme
async function edit() {
  if (prog.value.title) {
    const t = JSON.parse(JSON.stringify(prog.value))
    await addProg(t, false)
    clear(id)

    // bounce to home page
    await navigateTo('/')
  }
}

// if we have and id, load the programme from the API
if (id) {
  try {
    const p = get(id)
    if (p) {
      prog.value = p
    } else {
      prog.value = await getProgFromAPI(id)
      prog.value.ts = Math.floor(new Date().getTime() / 1000)
    }
  } catch (e) {
    console.error('failed to fetch prog', e)
  }
}
</script>
<style>
.divider {
  margin-top: 25px;
  margin-bottom: 25px;
}
</style>
<template>
  <PageTitle title="Edit"></PageTitle>
  <ProgrammeForm :prog="prog" :busy="busy" buttonTitle="Edit" @submit="edit()"></ProgrammeForm>
  <hr class="divider" />
  <v-btn color="error" variant="flat" @click="deleteProg(prog.id); clear(prog.id); navigateTo('/')">Delete</v-btn>
</template>
