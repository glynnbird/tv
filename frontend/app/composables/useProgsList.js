const PROGS_KEY = 'progscache'

// the default export
export default function () {

  // composables
  const progs = useState('progs', () => [])
  const stick = useState('stick', () => { return false })
  const { auth } = useAuth()
  const { setBusy, unsetBusy } = useBusy()
  const config = useRuntimeConfig()
  const { showAlert } = useShowAlert()
  const apiHome = config.public['apiBase'] || window.location.origin


  // empty prog
  function emptyProg() {
    return {
      title: '',
      description: '',
      stars: '',
      on: '',
      date: new Date(),
      pic: '',
      watching: false,
      type: '',
      uptoep: '0',
      uptomax: '6',
      season: '',
      ts: Math.floor(new Date().getTime() / 1000)
    }
  }
  
  // calculate the image URL for a programme
  function getImageURL(prog) {
    return `${apiHome}/api/img?id=${prog.id}&ts=${prog.ts || '0'}`
  }

  // load progs from the API
  async function loadFromAPI() {
    try {
      //  fetch the list from the API
      console.log('API', '/list', `${apiHome}/api/list`)
      setBusy()
      const r = await $fetch(`${apiHome}/api/list`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      progs.value = r.list.map(deserialize)
      localStorage.setItem(PROGS_KEY, JSON.stringify(progs.value))
      unsetBusy()
    } catch (e) {
      console.error('failed to fetch list of progs', e)
    }
  }

  // add a new programme
  async function addProg(prog, push = true) {
    console.log('API', '/add')
    try {
      setBusy()
      const doc = {}
      Object.assign(doc, prog)
      serialize(doc)
      const ret = await $fetch(`${apiHome}/api/add`, {
        method: 'post',
        body: doc,
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      prog.id = ret.id
      prog.date = new Date(prog.date)
      if (push) {
        progs.value.push(prog)
      } else {
        const ind = locateIndex(prog.id)
        if (ind !== -1) {
          progs.value[ind] = prog
        }
      }
      localStorage.setItem(PROGS_KEY, JSON.stringify(progs.value))
      unsetBusy()

      // create alert
      showAlert('Added/updated programme', 'primary')
    } catch (e) {
      console.error(e)
    }
  }

  async function getProgFromAPI(id) {
    //  fetch the list from the API
    try {
      console.log('API', '/get', `${apiHome}/api/get`)
      setBusy()
      const r = await $fetch(`${apiHome}/api/get`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        },
        body: { id }
      })
      unsetBusy()
      return r.doc
    } catch (e) {
      console.error('Could not load prog', id, e)
      unsetBusy()
      // create alert
      showAlert('Could not load programme', 'warning')
    }
    return {}
  }

  const locateIndex = (id) => {
    let i
    for (i in progs.value) {
      if (id === progs.value[i].id) {
        return i
      }
    }
    return -1
  }

  // toggle the watched flag for a programme
  async function toggle(id) {
    const ind = locateIndex(id)
    if (ind !== -1) {
      progs.value[ind].watching = !progs.value[ind].watching
    }

    console.log('API', '/toggle', id)
    try {
      setBusy()
      const ret = await $fetch(`${apiHome}/api/toggle`, {
        method: 'post',
        body: {
          id,
          ts: Math.floor(new Date().getTime() / 1000)
        },
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      unsetBusy()
    } catch (e) {
      unsetBusy()
      console.error('Could not toggle', id, e)
    }
  }

  // add one to the progress count
  async function plusOne(p) {
    console.log('+1', p.title)
    if (p.type === 'Series') {
      // increment the passed in object
      let upto = parseInt(p.uptoep)
      p.uptoep = (upto + 1).toString()
      console.log('incremented to', p.uptoep)
      p.ts = Math.floor(new Date().getTime() / 1000)

      // find the prog in the list
      const ind = locateIndex(p.id)
      if (ind !== -1) {
        progs.value[ind].uptoep = p.uptoep
      }

      // update the API
      await addProg(p, false)
    }
  }

  // delete a TV programme
  async function deleteProg(id) {
    const ind = locateIndex(id)
    if (ind) {
      progs.value.splice(ind, 1)
    }
    setBusy()
    await $fetch(`${apiHome}/api/del`, {
      method: 'post',
      body: {
        id
      },
      headers: {
        'content-type': 'application/json',
        apikey: auth.value.apiKey
      }
    })
    unsetBusy()

    // create alert
    showAlert('Deleted Programme', 'error')
  }

  // computed values
  const availableProgs = computed(() => {
    const now = new Date().toISOString()
    return progs.value.filter((p) => {
      return p.date.toISOString() <= now && !p.watching
    }).sort(newestFirst)
  })
  const watchedProgs = computed(() => {
    return progs.value.filter((p) => {
      return p.watching
    }).sort(mostRecentlyUpdatedFirst)
  })
  const futureProgs = computed(() => {
    const now = new Date().toISOString()
    return progs.value.filter((p) => {
      return p.date.toISOString() >= now
    }).sort(oldestFirst)
  })

  // load the data from the cache & the API, but only the first time this is invoked
  if (stick.value === false && progs.value.length === 0) {

    // load existing progs from localStorage
    console.log('loading from cache')
    const cache = localStorage.getItem(PROGS_KEY)
    if (cache) {
      progs.value = JSON.parse(cache).map(deserialize)
    }

    // then later get fresh data from the API
    setTimeout(async () => {
      console.log('loading from API')
      await loadFromAPI()
      stick.value = true
    }, 1)
  }

  return { progs, emptyProg, getImageURL, addProg, loadFromAPI, plusOne, toggle, deleteProg, getProgFromAPI, availableProgs, watchedProgs, futureProgs }
}
