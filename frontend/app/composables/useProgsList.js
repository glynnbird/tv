const PROGS_KEY = 'progscache'

// sort functions

// sort programmes newest first
const newestFirst = function (a, b) {
  if (a.date.getTime() < b.date.getTime()) {
    return 1;
  } else if (a.date > b.date) {
    return -1;
  }
  return 0;
}

// sort programmes oldest first
function oldestFirst(a, b) {
  if (a.date.getTime() < b.date.getTime()) {
    return -1;
  } else if (a.date > b.date) {
    return 1;
  }
  return 0;
}

// sort programmes most recently updated first
function mostRecentlyUpdatedFirst(a, b) {
  a.ts = a.ts || 0
  b.ts = b.ts || 0
  if (a.ts < b.ts) {
    return 1;
  } else if (a.ts > b.ts) {
    return -1;
  }
  return 0;
}

// convert data from the form required to store it as JSON, into a dynamic object again
// - convert date string to Date object
// - convert stars array into comma-separated string
function deserialize(p) {
  // convert plain object to form required by front end
  p.date = new Date(p.date)
  if (Array.isArray(p.stars)) {
    p.stars = p.stars.join(',')
  }
  return p
}

// convert data from the form required by the front end into the form required to store as JSON
// - convert Date object to string
// - convert stars comma-separated string to array
function serialize(p) {
  // convert plain object to form required by front end
  p.date = new Date(p.date)
  if (typeof p.stars === 'string' && p.stars.length > 0) {
    p.stars = p.stars.split(',').map((s) => { return s.trim()})
  }
  p.ts = Math.floor(new Date().getTime() / 1000)
  return p
}

export default function () {
  // state
  const progs = useProgs()

  // composables
  const auth = useAuth()
  const config = useRuntimeConfig()
  const stick = useStick()
  const apiHome = config.public['apiBase'] || window.location.origin

  // load existing progs from localStorage
  if (stick.value === false && progs.value.length === 0) {
    console.log('loading from cache')
    const cache = localStorage.getItem(PROGS_KEY)
    if (cache) {
      progs.value = JSON.parse(cache).map(deserialize)
    }
  }

  // load progs from the API
  async function loadFromAPI() {
    try {
      //  fetch the list from the API
      console.log('API', '/list', `${apiHome}/api/list`)
      const r = await $fetch(`${apiHome}/api/list`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      progs.value = r.list.map(deserialize)
      localStorage.setItem(PROGS_KEY, JSON.stringify(progs.value))
    } catch (e) {
      console.error('failed to fetch list of progs', e)
    }
  }

  // add a new programme
  async function addProg(prog, push=true) {
    console.log('API', '/add', prog)
    try {
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
      }
      localStorage.setItem(PROGS_KEY, JSON.stringify(progs.value))
      console.log('saved', prog)
    } catch (e) {
      console.error(e)
    }
  }
  
  async function getProgFromAPI(id) {
    let prog
    
    //  fetch the list from the API
    console.log('API', '/get', `${apiHome}/api/get`)
    const r = await $fetch(`${apiHome}/api/get`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        apikey: auth.value.apiKey
      },
      body: { id }
    })
    console.log(r.doc)
    
    prog = r.doc
    console.log('prog', prog)
    return prog
  }

  const locateIndex = (id) => {
    let i
    console.log('locateIndex', id, progs.value)
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
      const ret = await $fetch(`${apiHome}/api/toggle`, {
        method: 'post',
        body: {
          id,
          ts:  Math.floor(new Date().getTime() / 1000)
        },
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
    } catch (e) {
      console.error('Could not toggle', id, e)
    }
  }

  // add one to the progress count
  async function plusOne(id) {
    const ind = locateIndex(id)
    if (ind === -1) {
      return
    }
    const prog = progs.value[i]

    if (prog.value.type === 'Series') {
      console.log('incrementing')
      let upto = parseInt(prog.value.uptoep)
      prog.value.uptoep = (upto + 1).toString()
    } else {
      return
    }
    await addProg(prog.value)
  }

  async function deleteProg(id) {
    const ind = locateIndex(id)
    if (ind) {
      progs.value.splice(ind, 1)
    }
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

  // load the data from the API
  if (stick.value === false) {
    setTimeout(async () => {
      console.log('here')
      await loadFromAPI()
      stick.value = true
    }, 1)
  }
  

  return { progs, addProg, loadFromAPI, plusOne, toggle, deleteProg, getProgFromAPI, availableProgs,  watchedProgs, futureProgs }
}
