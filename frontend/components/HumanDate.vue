<script setup>
  // input attributes
  const { date } = defineProps(['date'])

  // local page items
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const th = function(v) {
    if (v % 10 === 1) {
      return `${v}st`
    } else if (v % 10 === 2) {
      return `${v}nd`
    } else if (v % 10 === 3) {
      return `${v}rd`
    } else {
      return `${v}th`
    }
  }
  const formatDate = function(d) {
    d = new Date(d)
    return th(d.getDate()) + ' ' + months[d.getMonth()]
  }
</script>
<template>
  {{ formatDate(date) }}
</template>
