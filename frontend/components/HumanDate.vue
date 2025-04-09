<script setup>
  // input attributes
  const { date, showYear } = defineProps(['date', 'showYear'])

  // local page items
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const th = function(v) {
    if (v >=10 && v <= 19) {
      return `${v}th`
    } else if (v % 10 === 1) {
      return `${v}st`
    } else if (v % 10 === 2) {
      return `${v}nd`
    } else if (v % 10 === 3) {
      return `${v}rd`
    } else {
      return `${v}th`
    }
  }
  const formatDate = function(d, showYear) {
    d = new Date(d)
    let retval = th(d.getDate()) + ' ' + months[d.getMonth()]
    if (showYear) {
      retval += ' ' + d.getFullYear()
    }
    return retval
  }
</script>
<template>
  {{ formatDate(date, showYear) }}
</template>
