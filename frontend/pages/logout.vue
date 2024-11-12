<script setup>
  // composables
  const auth = useAuth()
  auth.value.authenticated = false
  localStorage.removeItem('tvapikey')
  await navigateTo('/login')
</script>
