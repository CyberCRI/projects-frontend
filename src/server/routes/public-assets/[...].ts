import { usePublicURL } from '~/composables/usePublic'

// https://www.youtube.com/watch?v=J4E5uYz5AY8
export default defineEventHandler(async (event) => {
  // get runtimer config
  const path = event.path.replace(/^\/public-assets/, '')
  const target = usePublicURL(path)
  // proxy it
  // h3 function, https://www.jsdocs.io/package/h3#proxyRequest
  return proxyRequest(event, target)
})
