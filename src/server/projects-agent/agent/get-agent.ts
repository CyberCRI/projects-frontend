import toolMonitoringMiddleware from '@/server/projects-agent/middlewares/tool-monitor'
import getRetrieverTool from '@/server/projects-agent/tools/get-retriever-tool-new'
import traceLangchain from '@/server/projects-agent/tracers/trace-langchain'
import loggingMiddleware from '@/server/projects-agent/middlewares/logging'
import getMcpTools from '@/server/projects-agent/tools/get-mcp-tools'
import getLlmModel from '@/server/projects-agent/model/get-llm-model'
import getSkills from '@/server/projects-agent/tools/get-skills'
import getVectorStore from '@/server/utils/vector-db-new.js'
import { SystemMessage } from '@langchain/core/messages'
import { createAgent } from 'langchain'

export default async function getAgent(agentData, event, conversationId) {
  const tools = []

  /* --------- MCPs  --------- */

  if (agentData.useProjectsMcp || agentData.mcps.length) {
    const mcpTools = await getMcpTools(agentData, event, conversationId)
    tools.unshift(...mcpTools)
  }

  /* --------- Skills  --------- */

  let skillSystemPromptExtra = ''
  if (agentData.skillContents.length) {
    traceLangchain(`Found ${agentData.skillContents.length} skills`)
    const skills = getSkills(agentData)
    const loadSkill = skills.loadSkill
    skillSystemPromptExtra = skills.skillSystemPromptExtra
    tools.unshift(loadSkill)
  }

  /* --------- Vector Stores  --------- */

  // TODO: set vector store iu agent ?
  const { vectorStore } = await getVectorStore()
  if (vectorStore) {
    const retrieverTool = getRetrieverTool(agentData, vectorStore)
    tools.push(retrieverTool)
  }

  /* --------- memory ---------------- */

  /* --------- LLM settings  --------- */

  const model = await getLlmModel(agentData)

  /* --------- Agent setup  --------- */

  // traceLangchain(`<system-prompt>
  //   ${agentData.promptContent.content + skillSystemPromptExtra}
  //   <system-prompt>`)
  const agent = createAgent({
    model,
    tools,
    // TODO reanble checkpoint after tests
    // checkpointer,
    systemPrompt: new SystemMessage(agentData.promptContent.content + skillSystemPromptExtra),
    // stateSchema: AgentState as StateSchema<any>,
    middleware: [
      toolMonitoringMiddleware,
      loggingMiddleware,
      // debugCircularRef,
      // contextEditingMiddleware({
      //   // TODO: make configurable in agent data{
      //   edits: [
      //     new ClearToolUsesEdit({
      //       triggerTokens: 1000, // 10_000, // 1 ingle-spaced page ~= 3500 chars
      //       keep: 3, // keep at least n tool call
      //     }),
      //   ],
      // }),
      // summarizationMiddleware({
      //   // TODO: make configurable in agent data
      //   model, // TODO: make model independent from agent  model
      //   trigger: { tokens: 1600 }, // 16_000 }, // 1 ingle-spaced page ~= 3500 chars
      //   keep: { messages: 4 }, // 42 },
      // }),
    ] as any,
  })
  return agent
}
