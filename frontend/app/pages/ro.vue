<script setup>
  const route = useRoute()
  const { auth } = useAuth()
  const apikey = route.query.apikey
  if (apikey) {
    auth.value = {
      authenticated: true,
      apiKey: apikey
    }
  }
  const { watchedProgs } = useProgsList()
  definePageMeta({ layout : 'custom'})

</script>
<template>
  <TabNav target="/ro"></TabNav>
  <!-- refresh the app -->
  <PWARefresh></PWARefresh>

  <!-- tab content -->
  <TabContent readonly></TabContent>
</template>
