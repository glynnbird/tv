import { okResponse, notOkResponse, notOk } from './lib/constants.js'
import { mustBePOST, mustBeJSON, apiKey, handleCORS } from './lib/checks.js'
import { del, archive } from './lib/db.js'

export async function onRequest(context) {
  // handle POST/JSON/apikey checks
  const r =  handleCORS(context.request) || apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r

  // parse the json
  const json = await context.request.json()

  // if there's a id
  if (json.id) {
    let response
    // load the original
    doc = await get(context.env.TVKV, json.id)

    // delete the id from the KV store
    response = await del(context.env.TVKV, json.id)

    // save the doc as an archived doc
    await archive(context.env.TVKV, { id: json.id, doc })

    // send response
    return new Response(JSON.stringify(response), okResponse)
  }

  // everyone else gets a 400 response
  return new Response(notOk, notOkResponse)
  
}
