import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres'
import { MemorySaver } from '@langchain/langgraph'

// Singleton
let checkpointerInstance: PostgresSaver | MemorySaver | null = null

export default async function useCheckpointerDb() {
  console.log('[CHECKPTR] called')

  if (checkpointerInstance) {
    console.log('[CHECKPTR] using singleton')
    return { checkpointer: checkpointerInstance }
  }

  const runtimeConfig = useRuntimeConfig()
  const connectionString = runtimeConfig.appChatbotPromptDb

  if (connectionString) {
    console.log('[CHECKPTR] has config')
    try {
      const pg = PostgresSaver.fromConnString(connectionString, {
        schema: 'agents_memory',
      })
      console.log('[CHECKPTR] about to setup')
      await pg.setup()
      console.log('[CHECKPTR] set up')
      checkpointerInstance = pg
    } catch (e) {
      console.error('[CHECKPTR]', e)
    }
  }

  if (!checkpointerInstance) {
    console.log('[CHECKPTR] fallback to memory saver')
    checkpointerInstance = new MemorySaver()
  }

  return { checkpointer: checkpointerInstance }
}
