import { okResponse, notOkResponse, missingResponse, notOk } from './lib/constants.js'

export default {
  async fetch (request, env, ctx) {

    // parse the json
    const json = await request.json()

    // if there's a id
    if (json.id) {
      // delete the id from the KV store
      const key = `prog:${json.id}`
      const { value, metadata } = await env.TODOLIST.getWithMetadata(key)
      const v = JSON.parse(value)
      if (v === null) {
        return new Response(JSON.stringify({ ok: false, msg: 'Missing' }), missingResponse);
      }
      console.log(json.id, JSON.stringify(v), JSON.stringify(metadata))

      // send response
      return new Response(JSON.stringify({ ok: true, prog: { id: json.id, ...v, ...metadata } }), okResponse)
    }

    // everyone else gets a 400 response
    return new Response(notOk, notOkResponse)
  }
}
