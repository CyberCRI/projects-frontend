const runtimeConfig = useRuntimeConfig()
const { appAgentMemoryTrace } = runtimeConfig

export const traceAgentMemory = (...args) => {
  if (appAgentMemoryTrace) {
    console.log('[Agent Memory TRACE]', ...args)
  }
}
