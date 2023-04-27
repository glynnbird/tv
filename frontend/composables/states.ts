export const useProgList = () => useState<Array<object>>('progList', () => [])
export const useAlert = () => useState<object>('alert', () => { return {} })
export const useAuth = () => useState<object>('auth', () => { return { authenticated: false } })