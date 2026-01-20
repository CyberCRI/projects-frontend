export default defineEventHandler(async (event) => {
  // TODO: check request origin and thtottle requests to avoid abuse
  const runtimeConfig = useRuntimeConfig()
  if (!runtimeConfig.public.appGotenbergEnabled || !runtimeConfig.appGotenbergServerUrl) {
    // return 404
    return setResponseStatus(event, 404, 'Page Not Found')
  }
  const gotenbergServerUrl = runtimeConfig.appGotenbergServerUrl
  const gotenbergUrl = `${gotenbergServerUrl}/forms/chromium/convert/html`
  try {
    console.log('Proxying request to Gotenberg server at:', gotenbergUrl)
    return proxyRequest(event, gotenbergUrl)
  } catch (e) {
    console.error('Error proxying request to Gotenberg server:', e)
    return setResponseStatus(event, 502, 'Bad Gateway')
  }
})
