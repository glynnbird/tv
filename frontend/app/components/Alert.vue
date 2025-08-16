<script setup>
  // composables
  const { queue } = useShowAlert()
</script>
<template>
  <v-snackbar-queue v-model="queue" timeout="2000" color="error" />
</template>
