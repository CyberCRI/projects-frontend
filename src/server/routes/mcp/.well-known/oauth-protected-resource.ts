export default defineLazyEventHandler(() => {
  const { appMcpServerUrl } = useRuntimeConfig()
  const { appKeycloakUrl, appKeycloakRealm } = useRuntimeConfig().public

  return defineEventHandler(async () => {
    // TODO: use root url ('/') ???
    return {
      resource: appMcpServerUrl,
      authorization_servers: [
        `${appKeycloakUrl}/realms/${appKeycloakRealm}/.well-known/openid-configuration`,
      ],
    }
  })
})
