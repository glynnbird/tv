<script setup>

// input attributes
const { progs, readonly } = defineProps({ progs: Array, readonly: Boolean })

</script>
<template>
  <ProgCard v-for="prog in progs" :prog="prog" showActions="false" :readonly="readonly"></ProgCard>

  <!-- if empty, show instructions -->
  <div v-if="progs.length === 0">
    Your list is empty. Start by clicking the <NuxtLink href="/add">+</NuxtLink> icon in the top left.
  </div>
</template>
