<script setup>
// composables
const { addProg, emptyProg } = useProgsList()
const { prefill } = useAI()
const { busy } = useBusy()

// local page items
const aiurl = ref('')
const prog = ref(emptyProg())

// use AI to pre-fill the form
async function prefillForm() {
  const response = await prefill(aiurl.value)
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
<template>
  <PageTitle title="Add"></PageTitle>
  <v-alert title="AI Assistant" color="blue-lighten-4" style="margin-bottom: 20px">
    <v-form class="ai">
      <v-text-field v-model="aiurl" label="URL of a page about the programme"></v-text-field>
      <v-btn :disabled="aiurl.length === 0 || busy" color="success" @click="prefillForm()">
        <v-icon color="white" icon="mdi-auto-fix"></v-icon>
      </v-btn>
    </v-form>
  </v-alert>
  <ProgrammeForm :prog="prog" buttonTitle="Add" @submit="add()"></ProgrammeForm>
</template>
