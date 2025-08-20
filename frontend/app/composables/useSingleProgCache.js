// the default export
export default function () {
  const { progs, locateIndex } = useProgsList()

  function setProgCache(id, prog) {
    const i = locateIndex(id)
    if (i) {
      console.log('prog cache set', id)
      prog.full = true
      progs.value[i] = prog
    }
  }

  function getProgCache(id) {
    const i = locateIndex(id)
    if (i && progs.value[i].full) {
      console.log('prog cache hit', id)
      return progs.value[i]
    } else {
      console.log('prog cache miss', id)
      return null
    }
  }

  return { setProgCache, getProgCache }
}
