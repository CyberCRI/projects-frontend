import { initializeServerClientApi } from '~/config/apis'

export default defineNitroPlugin(() => {
  // initiliaze client api config for nuxt server (chatbot/mcp ...ect)
  if (import.meta.server) {
    const runtimeConfig = useRuntimeConfig()
    const baseURL = runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/'
    console.info(`Initialize ClientAPI in server, baseURL: ${baseURL}`)
    initializeServerClientApi(baseURL)
  }
})
