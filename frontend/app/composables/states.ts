export const useProgs = () => useState<Array<object>>('progs', () => [])
export const useAlert = () => useState<object>('alert', () => { return { message: '', show: false, colour: 'primary' } })
export const useAuth = () => useState<object>('auth', () => { return { authenticated: false, apiKey: false } })
export const useStick = () => useState<Boolean>('stick', () => { return false })

