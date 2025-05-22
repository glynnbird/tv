

import { okResponse, notOkResponse, missingResponse, notOk } from './lib/constants.js'
import { mustBePOST, mustBeJSON, apiKey, handleCORS } from './lib/checks.js'

export async function onRequest(context) {
  // handle POST/JSON/apikey chcecks
  const r = handleCORS(context.request) || apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r

  // parse the json
  const json = await context.request.json()

  const response = await context.env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
    stream: false,
    max_tokens: 512,
    messages: [
      { role: "user", content: "Please summarise the following text as JSON and return the title of the TV programme, five cast members, the number of episodes, the channel it is broadcast on in the UK, the first date of broadcast in the UK and a synopsis of what it's about, as a JSON object please." }
    ]
  })
  const obj = {
    ok: true,
    response
  }


  // send response
  return new Response(JSON.stringify(obj), okResponse)
}
