<script setup>
  // composables
  const { getProgFromAPI, addProg, deleteProg } = useProgsList()
  const route = useRoute()
  const id = route.params.id

  // local page items
  const prog = ref({})

  // add busy flag
  const busy = ref(false)

  // method - edit programme
  async function edit() {
    if (!prog.value.title) {
      return
    }
    busy.value = true
    const t = JSON.parse(JSON.stringify(prog.value))
    await addProg(t, false)
    busy.value = false

    // bounce to home page
    await navigateTo('/')
  }

  // if we have and id, load the programme from the API
  if (id) {
    try {
      prog.value = await getProgFromAPI(id)
      prog.value.ts = Math.floor(new Date().getTime() / 1000)
    } catch (e) {
      console.error('failed to fetch prog', e)
    }
  }
</script>
<style>
.divider {
  margin-top:25px;
  margin-bottom: 25px;
}
</style>
<template>
  <PageTitle title="Edit!"></PageTitle>
  <ProgrammeForm :prog="prog" :busy="busy" buttonTitle="Edit" @submit="edit()"></ProgrammeForm>
  <hr class="divider" />
  <v-btn color="error" variant="flat" @click="deleteProg(prog.id); navigateTo('/')">Delete</v-btn>
</template>
