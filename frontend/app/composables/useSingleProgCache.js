// the default export
export default function () {
  const prog = useState('prog', () => {})
  const progId = useState('progId', () => '')

  // stash the last loaded full programme object and id
  function set(pid, p) {
    prog.value = p
    progId.value = pid
    console.log('prog cache set', pid)
  }

  function get(pid) {
    if (pid === progId.value) {
      console.log('prog cache hit', pid)
      return prog.value
    } else {
      console.log('prog cache miss', pid)
      return null
    }
  }

  function clear(pid) {
    if (pid === progId.value) {
      prog.value = {}
      progId.value = ''
    }
  }

  return { set, get, clear }
}
