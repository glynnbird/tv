export default function () {

  // composables
  const auth = useAuth()
  const alert = useAlert()
  const config = useRuntimeConfig()

  async function prefill(url) {
    alert.value.ts = new Date().getTime()
    alert.value.message = 'No useful prefill data found'
    alert.value.colour = 'error'
    return

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
    if (ret && ret.ok === true && ret.response && ret.response.title) {
      const ai = ret.response
      console.log('ai', ai)
      ai.stars = ai.stars.join(',')
      ai.date = new Date(ai.date)
      return ai
    } else {
      console.log('AI response not useful', ret.response)
      alert.value.ts = new Date().getTime()
      alert.value.message = 'No useful prefill data found'
      alert.value.colour = 'error'
      return null 
    }
  }

  return { prefill }
}
