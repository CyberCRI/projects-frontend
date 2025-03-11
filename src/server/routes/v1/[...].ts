import { joinURL } from 'ufo'
// https://www.youtube.com/watch?v=J4E5uYz5AY8
export default defineEventHandler(async (event) => {
    // get runtimer config
    const runtimeConfig = useRuntimeConfig()
    const proxyUrl = runtimeConfig.public.appApiUrl
    // check path
    const path = event.path
    const target = joinURL(proxyUrl, path)
    console.log(target)
    // proxy it
    // h3 function, https://www.jsdocs.io/package/h3#proxyRequest
    return proxyRequest(event, target)
})
