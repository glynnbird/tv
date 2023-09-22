import { okResponse } from './lib/constants.js'
import { mustBePOST, mustBeJSON, apiKey } from './lib/checks.js'
import { queryIndex } from './lib/db.js'
 
export async function onRequest(context) {
  // handle POST/JSON/apikey chcecks
  const r = apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r

  // parse the query
  const json = await context.request.json()
  const key = json.key
  const value = json.value
  if (!key || !value) {
    // bad query
    return new Response(notOk, notOkResponse)
  }

  // list keys in the KV store, bound to this worker as TVKV
  const response = await queryIndex(context.env.TVKV, key, value)

  // send response
  return new Response(JSON.stringify({ ok: true, list: response }), okResponse)

}
