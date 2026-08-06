export default defineLazyEventHandler(() => {
  const { appKeycloakUrl } = useRuntimeConfig().public
  return defineEventHandler(async () => {
    // TODO: usePublicURL('/mcp') ???
    return { resource: usePublicURL('/'), authorization_servers: [appKeycloakUrl] }
  })
})
