import { okResponse, notOkResponse, notOk } from './lib/constants.js'
import { mustBePOST, mustBeJSON, apiKey, handleCORS } from './lib/checks.js'
import { add } from './lib/db.js'

export async function onRequest(context) {
  // handle POST/JSON/apikey chcecks
  const r = handleCORS(context.request) || apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r

  // parse the json
  const json = await context.request.json()

  // if there's a title
  if (json.title) {
    // create a time-based key
    const id = json.id || (new Date().getTime()).toString()

    const doc = {
      title: json.title,
      description: json.description || '',
      stars: json.stars || [],
      on: json.on || '',
      date: json.date || new Date().toISOString().substring(0,10),
      season: json.season || '',
      pic: json.pic || '',
      watching: json.watching || false,
      type: json.type || '',
      uptoep: json.uptoep || '',
      uptomax: json.uptomax || '',
      ts: json.ts || 0
    }
    const metadata = {
      date: doc.date,
      title: doc.title,
      watching: doc.watching,
      on: doc.on,
      uptoep: doc.uptoep,
      uptomax: doc.uptomax,
      type: doc.type,
      season: doc.season,
      ts: doc.ts
    }

    // add to KV store
    const response = await add(context.env.TVKV, { id, doc, metadata })

    // send response
    return new Response(JSON.stringify(response), okResponse)
  }
  
  // everyone else gets a 400 response
  return new Response(notOk, notOkResponse)

}
