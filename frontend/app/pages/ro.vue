<script setup>
const { watchedProgs } = useProgsList()
definePageMeta({ layout : 'custom'})

</script>
<template>
<ProgList :progs="watchedProgs" readonly></ProgList>
</template>
