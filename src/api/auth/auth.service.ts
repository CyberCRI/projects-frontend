import { axios } from '@/api/api.config'
import * as oauth from '@panva/oauth4webapi'
import keycloak from '@/api/auth/keycloak'
import router from '@/router'
import store from '@/store'

const DASHBOARD_URL = `${window.location.protocol}//${window.location.host}/dashboard`

/**
 *  The Authorization Code Flow with Proof Key for Code Exchange is described here :
 *  https://auth0.com/docs/authorization/flows/authorization-code-flow-with-proof-key-for-code-exchange-pkce
 *  Authorization provider : Keycloak
 *
 *  1 - The user clicks on "connection" button to trigger goToKeycloakLoginPage()
 *          it generates a random codeVerifier which is hashed into a codeChallenge and sent to /auth
 *          it generates a random appSecret that will later be checked when returned, to prove keycloak authenticity to the app
 *          it moves to Keycloak login page for the user to input his credentials
 *  2 - The user is redirected back to where he was and getAccessToken() is executed with the authCode sent back by Keycloak
 *          the codeVerifier and the authCode are sent to /token to be compared and an accessToken is delivered
 *  3 - The accessToken is then used to request projects API as an authenticated user
 *
 *  A refreshToken loop is initialized in main.js.
 *  If the user has a valid accessToken it gets its expiration date to set a refresh loop interval
 *  that asks for a new accessToken before it is expired.
 */

export async function goToKeycloakLoginPage(): Promise<void> {
    keycloak.codeVerifier.generate()
    keycloak.appSecret.generate()
    const currentUrl = new URL(keycloak.getCurrentUrl())
    const url = new URL(
        `${import.meta.env.VITE_APP_KEYCLOAK_URL}/realms/${
            import.meta.env.VITE_APP_KEYCLOAK_REALM
        }/protocol/openid-connect/auth`
    )

    const fromUrl =
        window.location.pathname === '/login' ? window.location.origin : window.location.href

    url.searchParams.append('client_id', keycloak.client.get().client_id)
    url.searchParams.append('client_secret', import.meta.env.VITE_APP_KEYCLOAK_CLIENT_SECRET)
    // redirect_uri is not useful here but required by Keycloak
    // redirect_uri must also be the same as the one from getAccessToken()
    url.searchParams.append('redirect_uri', `${currentUrl.origin}/dashboard`)
    url.searchParams.append('response_type', 'code')
    url.searchParams.append('scope', 'openid')
    url.searchParams.append('code_challenge', await keycloak.codeChallenge.get())
    url.searchParams.append('code_challenge_method', 'S256')
    url.searchParams.append(
        'state',
        JSON.stringify({
            // Store current location into keycloak state for redirection
            fromURL: fromUrl,
            // Store appSecret into keycloak state to verify keycloak authenticity when getting back the state
            appSecret: keycloak.appSecret.get(),
            org: store.getters['organizations/current']?.code,
        })
    )

    window.location.href = url.href
}

function cleanUpKeycloak() {
    keycloak.codeVerifier.remove()
    keycloak.appSecret.remove()
    keycloak.refreshTokenLoop.stop()
}

function getLogoutRedirectUri() {
    // redirect to current page after logout
    let redirectUri = keycloak.getCurrentUrl()
    const currentRoute = router.currentRoute

    // redirect to home after logout if we are on 404 page
    if (currentRoute && currentRoute.value.name == 'page404') {
        redirectUri = DASHBOARD_URL
    }

    // redirect to dashboard if we are on a page requiring auth to avoid a 404
    if (
        currentRoute &&
        currentRoute.value.matched &&
        currentRoute.value.matched.some(
            (route) => route.meta && (route.meta.requiresAuth || route.meta.requiresAdmin)
        )
    ) {
        redirectUri = DASHBOARD_URL
    }

    // redirect to dashboard if we are on a non-public project to avoid a 404
    if (
        currentRoute &&
        currentRoute.value.matched &&
        currentRoute.value.matched.some((route) => route.name === 'pageProject')
    ) {
        const project = store.getters['projects/project']
        if (!project || project.publication_status !== 'public') {
            redirectUri = DASHBOARD_URL
        }
    }
    return redirectUri
}

export function logoutFromKeycloak(): void {
    const redirectUri = getLogoutRedirectUri()
    cleanUpKeycloak()
    window.location.href = `${import.meta.env.VITE_APP_KEYCLOAK_URL}/realms/${
        import.meta.env.VITE_APP_KEYCLOAK_REALM
    }/protocol/openid-connect/logout?post_logout_redirect_uri=${redirectUri}&id_token_hint=${localStorage.getItem(
        'ID_TOKEN'
    )}`
}

export function logoutFromKeycloakWithError(): void {
    const redirectUri = getLogoutRedirectUri()
    cleanUpKeycloak()
    window.location.href = `${import.meta.env.VITE_APP_KEYCLOAK_URL}/realms/${
        import.meta.env.VITE_APP_KEYCLOAK_REALM
    }/protocol/openid-connect/logout?post_logout_redirect_uri=${redirectUri}&id_token_hint=${localStorage.getItem(
        'ID_TOKEN'
    )}&login-error=true`
}

export async function refreshAccessToken(): Promise<any> {
    const token = localStorage.getItem('REFRESH_TOKEN')
    const as = await keycloak.as.get()
    const client = keycloak.client.get()
    const response = await oauth.refreshTokenGrantRequest(
        as,
        client,
        token.replace('JWT' + ' ', '')
    )
    const result: oauth.TokenEndpointResponse | oauth.OAuth2Error =
        await oauth.processRefreshTokenResponse(as, client, response)
    const payload = await keycloak.processKeycloakResponse(result)
    return {
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
        refresh_token_exp: payload.refresh_token_exp,
        parsedToken: { ...payload.parsedToken },
        id_token: payload.id_token,
    }
}

export async function getNotifications(id) {
    // TODO: should getNotificationsSetting
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/notifications-setting/${id}/`
        )
    ).data
}

export async function patchNotifications({ id, payload }) {
    // TODO: should patchNotificationsSetting
    return (
        await axios.patch(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/notifications-setting/${id}/`,
            payload
        )
    ).data
}
