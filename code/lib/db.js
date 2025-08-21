
export const toggle = async function (kv, id, ts) {
  const { value, metadata } = await kv.getWithMetadata(`doc:${id}`)
  if (value === null) {
    return { ok: false }
  }
  const j = JSON.parse(value)
  await del(kv, id)
  j.doc.watching = !j.doc.watching
  j.doc.ts = ts
  j.metadata = metadata
  j.metadata.watching = j.doc.watching
  j.metadata.on = j.doc.on
  j.metadata.ts = ts
  await add(kv, j)
  return { ok: true }
}

export const get = async function (kv, id) {
  const r = await kv.get(`doc:${id}`)
  if (r === null) {
    return { ok: false }
  } else {
    const j = JSON.parse(r)
    j.doc.id = id
    return { ok: true, doc: j.doc }
  }
}

export const list = async function (kv) {
  const l = await kv.list({ prefix: 'doc:' })
  const output = l.keys.map((k) => {
    return {
      id: k.name.replace(/^doc:/, ''),
      ...k.metadata
    }
  })
  return output
}

export const archivelist = async function (kv) {
  const l = await kv.list({ prefix: 'archivedoc:' })
  const output = l.keys.map((k) => {
    return {
      id: k.name.replace(/^archivedoc:/, ''),
      ...k.metadata
    }
  })
  return output
}

// save an old doc into the archive
export const archive = async function (kv, json) {
  const metadata = {
    date: json.date,
    title: json.title,
    watching: json.watching,
    on: json.on,
    uptoep: json.uptoep,
    uptomax: json.uptomax,
    type: json.type,
    season: json.season,
    ts: json.ts
  }
  json.metadata = metadata

  // if there's all the parts we need
  if (json.id && json.doc && json.metadata) {
    // write core doc
    const coreDoc = {
      id: json.id,
      doc: json.doc,
      _ts: new Date().toISOString(),
    }
    delete coreDoc.doc.metadata
    await kv.put(`archivedoc:${json.id}`, JSON.stringify(coreDoc), { metadata: metadata })

    // send response
    return { ok: true, id: json.id }
  }

}

export const add = async function (kv, json) {
  if (!json.id) {
    json.id = new Date().getTime().toString()
  }
  if (!json.metadata) {
    json.metadata = {}
  }

  // if there's all the parts we need
  if (json.id && json.doc && json.metadata) {
    // write core doc
    const coreDoc = {
      id: json.id,
      doc: json.doc,
      _ts: new Date().toISOString(),
    }
    delete coreDoc.doc.metadata
    await kv.put(`doc:${json.id}`, JSON.stringify(coreDoc), { metadata: json.metadata })

    // send response
    return { ok: true, id: json.id }
  }

  // oops
  return { ok: false }
}

export const del = async function (kv, id) {

  // delete original doc
  await kv.delete(`doc:${id}`)

  return { ok: true }
}
