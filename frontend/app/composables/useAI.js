export default function () {

  // composables
  const auth = useAuth()
  const config = useRuntimeConfig()

  async function prefill(url) {
    console.log('API', '/ai')
    const apiHome = config.public['apiBase'] || window.location.origin
    const ret = await $fetch(`${apiHome}/api/ai`, {
      method: 'post',
      body: {
        url
      },
      headers: {
        'content-type': 'application/json',
        apikey: auth.value.apiKey
      }
    })
    if (ret && ret.ok === true) {
      const ai = ret.response
      console.log('ai', ai)
      ai.stars = ai.stars.join(',')
      ai.date = new Date(ai.date)
      return ai
    } else {
      return null 
    }
  }

  return { prefill }
}
