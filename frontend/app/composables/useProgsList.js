const PROGS_KEY = 'progscache'

// sort functions

// sort programmes newest first
const newestFirst = function (a, b) {
  if (a.date < b.date) {
    return 1;
  } else if (a.date > b.date) {
    return -1;
  }
  return 0;
}

// sort programmes oldest first
function oldestFirst(a, b) {
  if (a.date < b.date) {
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

export default function () {
  // state
  const progs = ref([])

  // composables
  const auth = useAuth()
  
  // calculate apiHome
  const config = useRuntimeConfig()

  // load existing progs from localStorage
  const cache = localStorage.getItem(PROGS_KEY)
  if (cache) {
    progs.value = JSON.parse(cache)
  }
  console.log('progs.value', progs.value)

  // load progs from the API
  async function loadFromAPI() {
    try {
      const apiHome = config.public['apiBase'] || window.location.origin

      //  fetch the list from the API
      console.log('API', '/list', `${apiHome}/api/list`)
      const r = await $fetch(`${apiHome}/api/list`, {
        method: 'post',
        headers: {
          'content-type': 'application/json',
          apikey: auth.value.apiKey
        }
      })
      progs.value = r.list
      localStorage.setItem(PROGS_KEY, JSON.stringify(progs.value))
    } catch (e) {
      console.error('failed to fetch list of progs', e)
    }
  }

   // computed values
  const availableProgs = computed(() => {
    const now = new Date().toISOString()
    return progs.value.filter((p) => {
      return p.date <= now && !p.watching
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
      return p.date >= now
    }).sort(oldestFirst)
  })

  // load the data from the API
  setTimeout(async () => {
    console.log('here')
    await loadFromAPI()
  }, 1)
 

  return { progs, loadFromAPI, availableProgs,  watchedProgs, futureProgs }
}
