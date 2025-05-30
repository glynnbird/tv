

import { okResponse, notOk, notOkResponse, missingResponse } from './lib/constants.js'
import { mustBePOST, mustBeJSON, apiKey, handleCORS } from './lib/checks.js'

const MODEL = '@cf/meta/llama-4-scout-17b-16e-instruct'
const MAX_TOKENS = 512
const PROMPT = `
Please summarise the following text as a JSON object with the following attributes:
- title: the title of the TV programme.
- description: a brief synopsis.
- stars: an array of strings containing up to five cast members, with no duplicates.
- on: the channel it is broadcast on in the UK - one of 'BBC','ITV','Channel4','Channel5','Netflix','AppleTV','Disney','Amazon','SkyAtlantic','Alba','Paramount','U'
- date: an ISO-8601 string representing the date of first broadcast in the UK.
- type: either "film" for a movie, "series" for a series and "oneoff" for everything else.
- uptomax: the number of episodes, if the type is a "series".
Please return a JSON object and nothing else.
`

function strip(html) {
  // Remove <script> tags and their content
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Remove <style> tags and their content
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Remove <head> section entirely (meta, title, etc.)
  html = html.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');

  // Remove all remaining HTML tags
  html = html.replace(/<\/?[^>]+(>|$)/g, ' ');

  // Decode basic HTML entities (optional – extend as needed)
  const entities = {
    '&nbsp;': ' ',
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'"
  };
  html = html.replace(/&[a-zA-Z#0-9]+;/g, (match) => entities[match] || '');

  // Replace multiple spaces and newlines with a single space
  html = html.replace(/\s+/g, ' ').trim();

  return html;
}

function extractOgImage(html) {
  // Match meta tag with property="og:image"
  const match = html.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  
  // If no match, try reversed order of attributes
  if (!match) {
    const altMatch = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);
    return altMatch ? altMatch[1] : null;
  }

  return match[1];
}

export async function onRequest(context) {
  // handle POST/JSON/apikey chcecks
  const r = handleCORS(context.request) || apiKey(context.request, context.env) || mustBePOST(context.request) || mustBeJSON(context.request)
  if (r) return r

  // parse the json
  const json = await context.request.json()

  // if there's a id
  if (json.url) {
    console.log('url', json.url)

    // fetch the URL
    const urlResponse = await fetch(json.url)
    console.log('status code', urlResponse.status)
    if (urlResponse.status === 200) {
      // get response text
      let html = await urlResponse.text()

      // find the og image
      const imageURL = extractOgImage(html)   

      // strip the tags
      html = strip(html)
      console.log('stripped HTML', html)

      // send it to the AI model
      const response = await context.env.AI.run(MODEL, {
        stream: false,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: "user", content: `${PROMPT} ---- ${html}` }
        ]
      })
      console.log('ai response', response.response)

      // strip backticks from the response
      const r = response.response.replace(/```/g,'')

      try {
        const r2 = JSON.parse(r)
        r2.pic = imageURL

        // return object
        const obj = {
          ok: true,
          response: r2
        }

        // send response
        return new Response(JSON.stringify(obj), okResponse)
      } catch {
        console.log('JSON parse failed')
      }

    } else {
      return new Response(notOk, missingResponse)
    }
  }

  // everyone else gets a 400 response
  return new Response(notOk, notOkResponse)

}
