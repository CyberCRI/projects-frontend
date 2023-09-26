import a from 'axios'

// need to be recreated here
// because in src/api/api.config.ts we import the store
// so for some reason the module is not ready on startup
const axios = a.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    withCredentials: true, // allow to set cookie from response
})

export async function removeApiCookie() {
    // unset cookie for API proxy
    document.cookie = 'jwt_access_token=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    // unset API cookie
    // TODO remove when API wioll not handle cookie set/remove anymore
    // https://github.com/CyberCRI/projects-api-Reloaded/issues/513
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/user/remove-authentication-cookie`
        )
    ).data
}
