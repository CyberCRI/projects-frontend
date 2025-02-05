import { useRuntimeConfig } from '#imports'

export async function removeApiCookie() {
    const runtimeConfig = useRuntimeConfig()
    // need to be recreated here
    // because in src/api/api.config.ts we import the store
    // so for some reason the module is not ready on startup
    const config = {
        baseURL: runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion,
        // withCredentials: true, // allow to set cookie from response
    }
    // unset cookie for API proxy
    document.cookie = 'jwt_access_token=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;'
    // unset API cookie
    // TODO remove when API wioll not handle cookie set/remove anymore
    // https://github.com/CyberCRI/projects-api-Reloaded/issues/513
    return await $fetch(`/user/remove-authentication-cookie`, config) //.data.value
}
