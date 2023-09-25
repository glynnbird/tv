import { okResponse, notOkResponse, notOk } from './lib/constants.js'
import { mustBePOST, mustBeJSON, apiKey } from './lib/checks.js'
import { del } from './lib/db.js'

export async function onRequest(context) {
  // handle POST/JSON/apikey checks
  const r = apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r

  // parse the json
  const json = await context.request.json()

  // if there's a id
  if (json.id) {
    // delete the id from the KV store
    console.log('request to delete', json.id)
    const response = await del(context.env.TVKV, json.id)

    // send response
    return new Response(JSON.stringify(response), okResponse)
  }

  // everyone else gets a 400 response
  return new Response(notOk, notOkResponse)
  
}
