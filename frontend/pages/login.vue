<script setup>
  // composables
  const auth = useAuth()

  // local page items
  const apiKey = ref('')

  // methods
  const saveKey = async () => {
    auth.value.authenticated = true
    auth.value.apiKey = apiKey.value
    localStorage.setItem('tvapikey', apiKey.value)
    await navigateTo('/')
  }
</script>
<template>
  <v-form>
    <v-text-field v-model="apiKey" label="Api Key" required></v-text-field>
    <v-btn :disabled="!apiKey" color="success" @click="saveKey">Submit</v-btn>
  </v-form>
</template>
