
export const toggle = async function (kv, id, ts) {
  const { value, metadata } = await kv.getWithMetadata(`doc:${id}`)
  if (value === null) {
    return { ok: false }
  }
  const j = JSON.parse(value)
  await del(kv, id)
  j.watching = !j.watching
  j.ts = ts
  await add(kv, j)
  return { ok: true }
}

export const get = async function (kv, id, archived=false) {
  const id = archived ? `archivedoc:${id}` : `doc:${id}`
  const r = await kv.get(id)
  if (r === null) {
    return { ok: false }
  } else {
    const j = JSON.parse(r)
    return { ok: true, doc: j }
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
const generateMetadata = function (doc) {
  return {
    date: doc.date,
    title: doc.title,
    watching: doc.watching,
    on: doc.on,
    uptoep: doc.uptoep,
    uptomax: doc.uptomax,
    type: doc.type,
    season: doc.season,
    ts: doc.ts
  }
}
// save an old doc into the archive
export const archive = async function (kv, json) {
  const metadata = generateMetadata(json)

  // if there's all the parts we need
  if (json && json.id && metadata) {
    await kv.put(`archivedoc:${json.id}`, JSON.stringify(json), { metadata: metadata })

    // send response
    return { ok: true, id: json.id }
  }
}

export const add = async function (kv, json) {
  if (!json.id) {
    json.id = new Date().getTime().toString()
  }
  const metadata = generateMetadata(json)

  // if there's all the parts we need
  if (json && json.id && metadata) {
    await kv.put(`doc:${json.id}`, JSON.stringify(json), { metadata })

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
