import { porterStemmer } from './stemmer.js'
import { process } from './process.js'

export const toggle = async function(kv, id) {
  const { value, metadata } = await kv.getWithMetadata(`doc:${id}`)
  if (value === null) {
    return { ok: false }
  }
  const j = JSON.parse(value)
  await del(kv, id)
  j.doc.watching = !j.doc.watching
  j.metadata = metadata
  j.metadata.watching = j.doc.watching
  await add(kv, j)
  return { ok: true}
}

export const get = async function(kv, id) {
  const r = await kv.get(`doc:${id}`)
  if (r === null) {
    return { ok: false }
  } else {
    const j = JSON.parse(r)
    j.doc.id = id
    return { ok: true, doc: j.doc }
  }
}

export const list = async function(kv) {
  const l = await kv.list({ prefix: 'doc:' })
  const output = l.keys.map((k) => {
    return {
      id: k.name.replace(/^doc:/,''),
      ...k.metadata
    }
  })
  return output
}

export const queryIndex = async function(kv, key, value) {
  const l = await kv.list({ prefix: `index:${key}:${value}` })
  const output = l.keys.map((k) => {
    return {
      id: k.name.replace(/^.+:/,''),
      ...k.metadata
    }
  })
  return output
}

export const add = async function (kv, json) {
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
    const words = process(json.freetext).map((w) => { return porterStemmer(w) })

    // write core doc
    const coreDoc = {
      id: json.id,
      doc: json.doc,
      _ts: new Date().toISOString(),
      _freetext: json.freetext,
      _freetextIndex: words,
      _index: json.index
    }
    delete coreDoc.doc.metadata
    const m = {
      metadata: json.metadata
    }
    await kv.put(`doc:${json.id}`, JSON.stringify(coreDoc), m)

    // // write secondary index docs for freetext search
    // for (const word of words) {
    //   await kv.put(`freetext:${word}:${json.id}`, null, { metadata: json.metadata })
    // }

    // // write secondary index docs for indexed items
    // if (json.index) {
    //   const keys = Object.keys(json.index)
    //   for (const key of keys) {
    //     const v = json.index[key]
    //     await kv.put(`index:${key}:${v}:${json.id}`, null, { metadata: json.metadata })
    //   }
    // }

    // send response
    return { ok: true, id: json.id }
  }

  // oops
  return { ok: false }
}

export const del = async function (kv, id) {
  // const r = await kv.get(`doc:${id}`)
  // const json = JSON.parse(r)
  // if (!json) {
  //   return { ok: false }
  // }

  // // delete free-text index
  // if (json['_freetextIndex']) {
  //   for (const word of json['_freetextIndex']) {
  //     await kv.delete(`freetext:${word}:${id}`)
  //   }
  // }

  // // write secondary index docs for indexed items
  // if (json['_index']) {
  //   const keys = Object.keys(json['_index'])
  //   for (const key of keys) {
  //     const v = json._index[key]
  //     await kv.delete(`index:${key}:${v}:${id}`)
  //   }
  // }

  // delete original doc
  await kv.delete(`doc:${json.id}`)

  return { ok: true }
}
