import { okResponse, notOkResponse, notOk } from './constants.js'
import { porterStemmer } from './stemmer.js'
import { process } from './process.js'

export const add = async function (json, kv) {
  console.log('adding', json)
  if (!json.id) {
    json.id = new Date().getTime().toString()
  }
  if (!json.metadata) {
    json.metadata = {}
  }
  if (!json.freetext) {
    json.freetext = ''
  }

  // if there's all the parts we need
  if (json.id && json.doc && json.metadata) {
    console.log('freetext', json.freetext)
    const words = process(json.freetext).map((w) => { return porterStemmer(w) })
    console.log(words)

    // write core doc
    const coreDoc = {
      id: json.id,
      doc: json.doc,
      metadata: json.metadata,
      _ts: new Date().toISOString(),
      _freetext: json.freetext,
      _freetextIndex: words,
      _index: json.index
    }
    await kv.put(`doc:${json.id}`, JSON.stringify(coreDoc))

    // write secondary index docs for freetext search
    for (const word of words) {
      await kv.put(`freetext:${word}:${json.id}`, null, { metadata: json.metadata })
    }

    // write secondary index docs for indexed items
    if (json.index) {
      const keys = Object.keys(json.index)
      for (const key of keys) {
        const v = json.index[key]
        await kv.put(`index:${key}:${v}:${json.id}`, null, { metadata: json.metadata })
      }
    }

    // send response
    return { ok: true, id: json.id }
  }

  // oops
  return { ok: false }
}

export const del = async function (id, kv) {
  console.log('deleting doc', id)
  const r = await context.env.TVKV.get(`doc:${json.id}`)
  const json = JSON.parse(r)

  // delete free-text index
  for (const word of words['_freetextIndex']) {
    await kv.delete(`freetext:${word}:${json.id}`)
  }

  // write secondary index docs for indexed items
  if (json['_index']) {
    const keys = Object.keys(json['_index'])
    for (const key of keys) {
      const v = json._index[key]
      await kv.delete(`index:${key}:${v}:${json.id}`)
    }
  }

  // delete original doc
  await kv.delete(`doc:${json.id}`)
}
