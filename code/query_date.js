import { okResponse } from './lib/constants.js'

export default {
  async fetch (request, env, ctx) {
    const json = await request.json()

    if (json.date) {
      // list keys in the KV store starting with a prefix
      const r = await env.TVKV.list({ prefix: `date:${json.date}` })

      // map to a list of objects
      const output = r.keys.map((k) => {
        return k.metadata
      })

      // send response
      return new Response(JSON.stringify({ ok: true, list: output }), okResponse)
    }

    // everyone else gets a 400 response
    return new Response(notOk, notOkResponse)

  }
}
