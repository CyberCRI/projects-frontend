import { joinURL } from 'ufo'
// https://www.youtube.com/watch?v=J4E5uYz5AY8
export default defineEventHandler(async (event) => {
  // get runtimer config
  // const runtimeConfig = useRuntimeConfig()
  const proxyUrl = 'https://criparisdevlabprojects.blob.core.windows.net' // runtimeConfig.public.appPublicBinariesPrefix?.replace(/\/assets\/public$/, '')
  // check path
  const path = event.path.replace(/^\/image-assets/, '')
  const target = joinURL(proxyUrl, path)

  console.log('proxied', target)
  // proxy it
  // h3 function, https://www.jsdocs.io/package/h3#proxyRequest
  return proxyRequest(event, target)
})
