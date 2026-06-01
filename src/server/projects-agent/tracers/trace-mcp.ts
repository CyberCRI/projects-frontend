const runtimeConfig = useRuntimeConfig()
const { appMcpServerTrace } = runtimeConfig

export const traceMcp = (...args) => {
  if (appMcpServerTrace) {
    console.log('[MCP TRACE]', ...args)
  }
}
