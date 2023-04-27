import { okResponse, notOkResponse, missingResponse, notOk } from './lib/constants.js'

export default {
  async fetch (request, env, ctx) {

    // parse the json
    const json = await request.json()

    // if there's a id
    if (json.id) {
      // delete the id from the KV store
      const key = `prog:${json.id}`
      const { value, metadata } = await env.TVKV.getWithMetadata(key)
      const v = JSON.parse(value)
      if (v === null) {
        return new Response(JSON.stringify({ ok: false, msg: 'Missing' }), missingResponse);
      }

      // delete the core doc
      await env.TVKV.delete(`prog:${json.id}`)

      // secondary indexes - by network
      if (metadata.n) {
        const key = `network:${metadata.n}:${json.id}`
        await env.TVKV.delete(key)
      }

      // secondary indexes - by date
      if (metadata.d) {
        const key = `date:${metadata.d}:${json.id}`
        await env.TVKV.delete(key)
      }

      // send response
      return new Response(JSON.stringify({ ok: true, id: json.id }), okResponse)
    }

    // everyone else gets a 400 response
    return new Response(notOk, notOkResponse)
  }
}
