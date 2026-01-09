export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const gotembergServerUrl = runtimeConfig.public.appGotembergServerUrl
  const gotembergUrl = `${gotembergServerUrl}/forms/chromium/convert/html`
  return proxyRequest(event, gotembergUrl)
})
