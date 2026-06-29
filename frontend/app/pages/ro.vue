<script setup>
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
