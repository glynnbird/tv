<script setup>
  const { archivedProgs, loadArchivedFromAPI } = useProgsList()

  await loadArchivedFromAPI()

</script>
<template>
  <!-- list of archived programmes -->
  <h2>Archive</h2>
  <ArchivedProgCard v-for="prog in archivedProgs" :key="prog.id" :prog="prog"></ArchivedProgCard>
</template>
