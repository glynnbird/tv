
export const useAuth = () => useState<object>('auth', () => { return { authenticated: false, apiKey: false } })


