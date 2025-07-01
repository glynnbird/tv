export default defineNuxtRouteMiddleware((to, from) => {
  // composables
  const { auth } = useAuth()

  // if we are not logged in
  if (!auth.value || !auth.value.authenticated) {
    // see if we have an apikey stashed in local storage
    console.log('loading auth from localStorage')
    const v = localStorage.getItem('tvapikey')
    if (v) {
      // log us in from the localstorage
      console.log('logging in from localStorage')
      auth.value = {}
      auth.value.authenticated = true
      auth.value.apiKey = v
    } else {
      console.log('not logged in')
    }
  }

  // if we're not already on the login page and we're not logged in... go to login page
  if (to.fullPath !== '/login' && (!auth.value || !auth.value.authenticated)) {
    return navigateTo('/login')
  }
})
