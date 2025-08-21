import { okResponse } from './lib/constants.js'
import { mustBePOST, mustBeJSON, apiKey, handleCORS } from './lib/checks.js'
import { archivelist } from './lib/db.js'
 
export async function onRequest(context) {
  // handle POST/JSON/apikey chcecks
  const r =  handleCORS(context.request) || apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r

  // list keys in the KV store, bound to this worker as TVKV (only archived docs)
  const response = await archivelist(context.env.TVKV)

  // send response
  return new Response(JSON.stringify({ ok: true, list: response }), okResponse)

}
