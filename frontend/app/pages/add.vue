<script setup>
  // composables
  const { addProg } = useProgsList()
  const { prefill } = useAI()
  const { busy, setBusy, unsetBusy } = useBusy()

  // local page items
  const aiurl = ref('')
  const prog = ref({
    title: '',
    description: '',
    stars: '',
    on: '',
    date: new Date(),
    pic: '', 
    watching: false,
    type: '',
    uptoep: '0',
    uptomax: '6',
    season: '',
    ts: Math.floor(new Date().getTime() / 1000)
  })


  // use AI to pre-fill the form
  async function prefillForm() {
    setBusy()
    const response = await prefill(aiurl.value)
    unsetBusy()
    if (response) {
      Object.assign(prog.value, response)
    }
  }

  // method - add new programme 
  async function add() {
    if (prog.value.title) {
      // save the new programme
      await addProg(JSON.parse(JSON.stringify(prog.value)))

      // bounce to home page
      await navigateTo('/')
    }
  }
</script>
<style>
.ai {
  margin-bottom: 20px;  
}
</style>
<template>
  <PageTitle title="Add"></PageTitle>
  <v-alert title="AI Assistant" color="blue-lighten-4" class="ai">
    <v-form class="ai">
      <v-text-field
        v-model="aiurl"
        label="URL of a page about the programme"
      ></v-text-field>
      <v-btn
        :disabled="aiurl.length === 0 || busy"
        color="success"
        @click="prefillForm()"
      >
        <v-icon
          color="white"
          icon="mdi-auto-fix"
        ></v-icon>
      </v-btn>

    </v-form>
  </v-alert>
  
  <ProgrammeForm :prog="prog" buttonTitle="Add" @submit="add()"></ProgrammeForm>
</template>
