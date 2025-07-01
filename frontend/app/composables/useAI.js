export default function () {

  // composables
  const auth = useAuth()
  const { showAlert } = useShowAlert()
  const config = useRuntimeConfig()

  // collect data to prefill the "add" form by using AI. An API call is sent a URL 
  // about a TV programme, which is dispatched to a LLM with a prompt asking it to
  // extract some structured data.
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
