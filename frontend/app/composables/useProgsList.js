const PROGS_KEY = 'progscache'

// the default export
export default function () {

  // composables
  const progs = useState('progs', () => [])
  const archivedProgs = useState('archivedProgs', () => [])
  const stick = useState('stick', () => { return false })
  const { auth } = useAuth()
  const { setBusy, unsetBusy } = useBusy()
  const config = useRuntimeConfig()
  const { showAlert } = useShowAlert()
  const apiHome = config.public['apiBase'] || window.location.origin

  // create a custom fetch, prefilled with common stuff
  const $api = $fetch.create({
    baseURL: apiHome,
    method: 'post',
    headers: {
      'content-type': 'application/json',
      apikey: auth.value.apiKey
    }
  })

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
  function getImageURL(prog, archived=false) {
    return `${apiHome}/api/img?id=${prog.id}&ts=${prog.ts || '0'}&archived=${archived}`
  }

  // load progs from the API
  async function loadFromAPI() {
    setBusy()
    try {
      //  fetch the list from the API
      console.log('API', '/api/list')
      const r = await $api('/api/list')
      progs.value = r.list.map(deserialize)
      localStorage.setItem(PROGS_KEY, JSON.stringify(progs.value))
      
    } catch (e) {
      console.error('failed to fetch list of progs', e)
    }
    unsetBusy()
  }

  // load archivedprogs from the API
  async function loadArchivedFromAPI() {
    setBusy()
    try {
      //  fetch the list from the API
      console.log('API', '/api/archivelist')
      const r = await $api('/api/archivelist')
      archivedProgs.value = r.list.map(deserialize).sort(newestFirst)
      
    } catch (e) {
      console.error('failed to fetch list of archived progs', e)
    }
    unsetBusy()
  }

  // add a new programme
  async function addProg(prog, push = true) {
    setBusy()
    try {
      console.log('API', '/api/add')
      const doc = {}
      Object.assign(doc, prog)
      serialize(doc)
      const ret = await $api('/api/add', { body: doc })
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
      
      // create alert
      showAlert('Added/updated programme', 'primary')
    } catch (e) {
      console.error(e)
    }
    unsetBusy()
  }

  async function getProgFromAPI(id) {
    let retval = {}
    setBusy()
    //  fetch the list from the API
    try {
      console.log('API', '/api/get')
      const r = await $api('/api/get', { body: { id } })
      retval = r.doc
    } catch (e) {
      console.error('Could not load prog', id, e)
      // create alert
      showAlert('Could not load programme', 'warning')
    }
    unsetBusy()
    return retval
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
    console.log('toggle index', ind)
    if (ind !== -1) {
      console.log('current', progs.value[ind].watching)
      progs.value[ind].watching = !progs.value[ind].watching
      console.log('now', progs.value[ind].watching)
    }

    console.log('API', '/api/toggle', id)
    setBusy()
    try {
      const body = {
        id,
        ts: Math.floor(new Date().getTime() / 1000)
      }
      const ret = await $api('/api/toggle', { body })
    } catch (e) {
      console.error('Could not toggle', id, e)
    }
    unsetBusy()
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
    console.log('API', '/api/del', id)
    await $api('/api/del', { body: { id } })
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

  return { progs, archivedProgs, loadArchivedFromAPI, locateIndex, emptyProg, getImageURL, addProg, loadFromAPI, plusOne, toggle, deleteProg, getProgFromAPI, availableProgs, watchedProgs, futureProgs }
}
