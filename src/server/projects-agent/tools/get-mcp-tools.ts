import { traceMcp } from '@/server/projects-agent/tracers/trace-mcp'
import { MultiServerMCPClient } from '@langchain/mcp-adapters'

export default async function getMcpTools(
  agentData: any,
  event: any,
  userToken: string
): Promise<any[]> {
  const runtimeConfig = useRuntimeConfig()
  const { appMcpServerUrl } = runtimeConfig
  const mcpConfigs = {}

  if (agentData.useProjectsMcp) {
    traceMcp('Adding projects MCP')
    mcpConfigs['projects-mcp'] = {
      // TODO use stdio or diect tool instead a mcp
      transport: 'http', // HTTP-based remote server
      url: appMcpServerUrl,
      headers: {
        Authorization: `${userToken}`,
      },
    }
  }

  agentData.mcps.forEach((mcp) => {
    const aConfig = {
      transport: mcp.transport,
    }
    if (mcp.transport == 'stdio') {
      aConfig['command'] = mcp.command
      aConfig['args'] = mcp.args
      traceMcp('Adding MCP tool with command:', mcp.command, mcp.args)
    } else {
      aConfig['url'] = mcp.url
      if (mcp.apiKey) {
        aConfig['headers'] = {
          Authorization: `Bearer ${mcp.apiKey}`,
        }
      }
      traceMcp(
        `Adding MCP tool with ${mcp.apikey ? 'authorization api key and' : ''} server URL: ${mcp.url}`
      )
    }

    const slug = mcp.title.replace(/\s+/gim, '_')

    mcpConfigs[slug] = aConfig
  })

  const client = new MultiServerMCPClient(mcpConfigs)

  // TODO: add middlkewrae to select tools
  const mcpTools = await client.getTools()
  traceMcp('mcp tool', JSON.stringify(mcpTools, null, 2))
  event.node.res.on('close', () => {
    client.close().catch(() => {})
  })

  return mcpTools
}
