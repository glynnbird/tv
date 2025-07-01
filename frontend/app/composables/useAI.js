export default function () {

  // composables
  const auth = useAuth()
  const { showAlert } = useShowAlert()
  const config = useRuntimeConfig()

  async function prefill(url) {
    console.log('API', '/ai')
    const apiHome = config.public['apiBase'] || window.location.origin
    try {
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
        showAlert('No useful prefill data found', 'error')
        return null 
      }
    } catch (e) {
      console.error('Could not invoke AI', e)
      showAlert('No useful prefill data found', 'error')
      return null
    }
  }

  return { prefill }
}
