import { okResponse, notOkResponse, notOk } from './lib/constants.js'

export default {
  async fetch (request, env, ctx) {

    // parse the json
    const json = await request.json()

    // if there's a title
    if (json.t && json.n) {
      // create a time-based key
      const id = (new Date().getTime()).toString()

      // write key/value to the KV store, bound to this worker as TODOLIST
      const metadata = {
        t: json.t,
        n: json.n,
        d: json.d,
        f: json.f,
        id: id
      }
      const value = {
        notes: json.notes
      }
      // put the data in "metadata" instead of value, so that it comes back
      // in the .list() request
      await env.TODOLIST.put(`prog:${id}`, JSON.stringify(value), { metadata })

      // secondary indexes - by network
      if (json.n) {
        const key = `network:${json.n}:${id}`
        await env.TODOLIST.put(key, null, { metadata })
      }

      // secondary indexes - by date
      if (json.d) {
        const key = `date:${json.d}:${id}`
        await env.TODOLIST.put(key, null, { metadata })
      }

      // send response
      return new Response(JSON.stringify({ ok: true, id: id }), okResponse)
    }
    
    // everyone else gets a 400 response
    return new Response(notOk, notOkResponse)
  }
}