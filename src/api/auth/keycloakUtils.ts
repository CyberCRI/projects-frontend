import { removeApiCookie } from '@/api/auth/cookie.service'

export function createRandomString(stringLength: number) {
    return [...Array(stringLength)].map(() => (~~(Math.random() * 20)).toString(20)).join('')
}

export function getRefreshTokenInterval(): number {
    const refreshToken = localStorage.getItem('REFRESH_TOKEN')
    if (!refreshToken) return -1

    const refreshTokenExpirationDate = parseFloat(localStorage.getItem('REFRESH_TOKEN_EXP'))
    if (isNaN(refreshTokenExpirationDate)) return -1
    // Calculate timeout before accessToken expiration (75% from expiration time)
    const refreshInterval = (refreshTokenExpirationDate * 1000 - Date.now()) * 0.75
    // check for negative on client side, this should not happen as expiration is checked for on app init
    return refreshInterval
}

export function cleanLocalStorage(): void {
    // Clean up localStorage from previous authentication system usage
    // SESSION_TOKEN was used when the authentication was managed by the backend
    if (localStorage.getItem('SESSION_TOKEN')) localStorage.removeItem('SESSION_TOKEN')
}

export function checkExpiredToken(): boolean {
    async function _cleanStorage() {
        localStorage.removeItem('REFRESH_TOKEN')
        localStorage.removeItem('REFRESH_TOKEN_EXP')
        localStorage.removeItem('ACCESS_TOKEN')
        localStorage.removeItem('USER_ID')
        localStorage.removeItem('ID_TOKEN')
        localStorage.removeItem('KEYCLOAK_ID')
        try {
            await removeApiCookie()
        } catch (e) {
            console.error(e)
        }
    }

    const refreshToken = localStorage.getItem('REFRESH_TOKEN')
    if (refreshToken) {
        const parts = refreshToken.split('.')
        if (parts.length > 1) {
            const refreshTokenExpirationDate =
                parseFloat(localStorage.getItem('REFRESH_TOKEN_EXP')) * 1000
            if (isNaN(refreshTokenExpirationDate) || refreshTokenExpirationDate < Date.now()) {
                // unlogging
                _cleanStorage()
                return true
            }
            // stay logged in, keep tokens
            return false
        }
    }
    // not (un-)logged, but some safety cleaning
    _cleanStorage()
    return false
}
