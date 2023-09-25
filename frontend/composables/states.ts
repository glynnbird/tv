export const useProgs = () => useState<Array<object>>('progs', () => [])
export const useAlert = () => useState<object>('alert', () => { return {} })
export const useAuth = () => useState<object>('auth', () => { return { authenticated: false } })
