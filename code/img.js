import { notOkResponse, missingResponse, notOk } from './lib/constants.js'
import { get } from './lib/db.js'

export async function onRequest(context) {
  const r =  handleCORS(context.request)
  if (r) return r

  // parse the json
  const { searchParams } = new URL(context.request.url)
  const id = searchParams.get('id')
  if (!id) {
    return new Response(notOk, notOkResponse)
  }

  // if there's a id
  if (id) {
    const response = await get(context.env.TVKV, id)
    if (response.doc.pic) {
      // send 302 response

      const redirectResponse = {
        status: 302,
        headers: {
          location: response.doc.pic
        }
      }
      return new Response('', redirectResponse)
    } else {
      // send 404 response
      return new Response(notOk, missingResponse)
    }
  }

  // everyone else gets a 400 response
  return new Response(notOk, notOkResponse)

}
