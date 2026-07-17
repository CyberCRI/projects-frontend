import { initializeServerClientApi } from '~/config/apis'

export default defineNitroPlugin(() => {
  // initiliaze client api config for nuxt server (chatbot/mcp ...ect)
  if (import.meta.server) {
    console.info('Initialize ClientAPI in server')

    const runtimeConfig = useRuntimeConfig()
    const baseURL = runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/'
    initializeServerClientApi(baseURL)
  }
})
