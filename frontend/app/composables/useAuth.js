
const AUTH_LOCAL_STORAGE_KEY = 'tvapikey'

export default function () {
  // the authentication state
  // authenticated - true if you are logged in
  // apiKey - the saved API key for logged in users
  const auth = useState('auth', () => { return { authenticated: false, apiKey: '' } })

  async function login(apiKey) {
    // log the user in
    auth.value.authenticated = true
    auth.value.apiKey = apiKey
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, apiKey)
    await navigateTo('/')
  }

  async function logout() {
    // log the user out
    auth.value.authenticated = false
    auth.value.apiKey = ''
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
    await navigateTo('/login')
  }

  // return the alert state and the showAlert function
  return { auth, login, logout }
}
