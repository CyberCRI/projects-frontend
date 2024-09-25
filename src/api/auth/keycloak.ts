import * as oauth from '@panva/oauth4webapi'
import {
    cleanLocalStorage,
    createRandomString,
    getRefreshTokenInterval,
} from '@/api/auth/keycloakUtils'
import store from '@/store'
import router from '@/router/index'

import useToasterStore from '@/stores/useToaster'
import i18n from '@/locales/i18n'

export type AuthResult = {
    access_token: string
    refresh_token: string
    refresh_token_exp: number
    parsedToken: any
    fromURL?: string
    id_token: string
}

const issuer = new URL(
    `${import.meta.env.VITE_APP_KEYCLOAK_URL}/realms/${import.meta.env.VITE_APP_KEYCLOAK_REALM}` // DO NOT add terminal slash here
)

const as: Promise<oauth.AuthorizationServer> = oauth
    .discoveryRequest(issuer)
    .then((response) => oauth.processDiscoveryResponse(issuer, response))

const client: oauth.Client = {
    client_id: import.meta.env.VITE_APP_KEYCLOAK_CLIENT_ID,
    token_endpoint_auth_method: 'client_secret_post',
    client_secret: import.meta.env.VITE_APP_KEYCLOAK_CLIENT_SECRET,
}

export default {
    as: {
        get(): Promise<oauth.AuthorizationServer> {
            return as
        },
    },

    client: {
        get(): oauth.Client {
            return client
        },
    },

    codeVerifier: {
        generate(): void {
            const codeVerifier = oauth.generateRandomCodeVerifier()
            localStorage.setItem('CODE_VERIFIER', codeVerifier)
        },

        get(): string {
            return localStorage.getItem('CODE_VERIFIER')
        },

        remove(): void {
            localStorage.removeItem('CODE_VERIFIER')
        },
    },

    codeChallenge: {
        async get(): Promise<string> {
            const codeVerifier = localStorage.getItem('CODE_VERIFIER')
            return await oauth.calculatePKCECodeChallenge(codeVerifier)
        },
    },

    appSecret: {
        generate(): void {
            const appSecret = createRandomString(64)
            localStorage.setItem('APP_SECRET', appSecret)
        },

        get(): string {
            return localStorage.getItem('APP_SECRET')
        },

        remove(): void {
            localStorage.removeItem('APP_SECRET')
        },
    },

    refreshTokenLoop: {
        loopId: null,
        start(): void {
            cleanLocalStorage()

            if (localStorage.getItem('ACCESS_TOKEN')) {
                const _refresh = () => {
                    // clear previous loop for safety
                    if (this.loopId) clearTimeout(parseInt(this.loopId))
                    this.loopId = null
                    // refresh
                    usersStore.doRefreshToken().then(() => {
                        // schedule next refresh
                        const interval = getRefreshTokenInterval()
                        if (interval > 0) {
                            this.loopId = setTimeout(_refresh, interval)
                        }
                    })
                }
                if (getRefreshTokenInterval() > 0) _refresh()
            }
        },

        stop(): void {
            if (this.loopId) clearTimeout(parseInt(this.loopId))
            this.loopId = null
        },
    },

    getCurrentUrl: () => {
        // there to be mocked in jest,
        // because I can't find a way to set the window.location.href in jest without breaking everything
        return window.location.href
    },

    async loginIfValidState(loginSearchParams: URLSearchParams): Promise<void> {
        const toaster = useToasterStore()
        try {
            const state = loginSearchParams.get('state')
                ? JSON.parse(loginSearchParams.get('state') as string)
                : null

            if (
                !loginSearchParams.get('code') ||
                !loginSearchParams.get('session_state') ||
                !state
            ) {
                return Promise.resolve()
            }

            const as = await this.as.get()
            const currentUrl: URL = new URL(this.getCurrentUrl())
            const params = oauth.validateAuthResponse(
                as,
                this.client.get(),
                loginSearchParams,
                oauth.skipStateCheck
            )
            if (oauth.isOAuth2Error(params)) {
                console.error('oauth error', params)
                this.onLoginError()
                return Promise.resolve()
            }

            const response = await oauth.authorizationCodeGrantRequest(
                as,
                this.client.get(),
                params,
                `${currentUrl.origin}/dashboard`, // redirect_uri,
                this.codeVerifier.get()
            )

            if (oauth.parseWwwAuthenticateChallenges(response)) {
                console.error('keycloak challenge error')
                this.onLoginError()
                return Promise.resolve()
            }

            const result = await oauth.processAuthorizationCodeOpenIDResponse(
                as,
                this.client.get(),
                response
            )
            const tokens = await this.processKeycloakResponse(result)

            await store
                .dispatch('users/logIn', {
                    ...tokens,
                    fromURL: state.fromURL,
                })
                .then(() => {
                    // due to async op user may not have been set
                    // before this call in main
                    // so restart loop after successful login
                    this.refreshTokenLoop.start()
                })
        } catch (e) {
            console.error(e)
            toaster.pushError(
                // message: i18n.messages[i18n.locale].message['error-login'],
                i18n.global.t('message.error-login')
            )
        }
    },

    processKeycloakResponse: async function (result): Promise<AuthResult | null> {
        if (oauth.isOAuth2Error(result)) {
            console.error(result)
            this.onLoginError()
            return null
        }
        const id_token: string = result.id_token
        const access_token: string = result.access_token
        const refresh_token: string = result.refresh_token
        const refresh_token_exp: number = result.refresh_expires_in + Math.floor(Date.now() / 1000)
        const parsedToken = await oauth.getValidatedIdTokenClaims(result)
        return { access_token, refresh_token, refresh_token_exp, parsedToken, id_token }
    },

    onLoginError(): void {
        const toaster = useToasterStore()
        const home = '/dashboard'
        toaster.pushError(i18n.global.t('message.error-login'))
        router.push(home)
    },
}
