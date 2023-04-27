import { okResponse } from './lib/constants.js'

export default {
  async fetch (request, env, ctx) {
    // list keys in the KV store, bound to this worker as TVKV
    const r = await env.TVKV.list({ prefix: 'prog:' })

    // map to a list of objects
    const output = r.keys.map((k) => {
      // k.name = 'prog:<id>'
      const id = k.name.match(/^prog:([0-9]+)$/)[1]

      return {
        id: id,
        ...k.metadata
      }
    })

    // send response
    return new Response(JSON.stringify({ ok: true, list: output }), okResponse)
  }
}
