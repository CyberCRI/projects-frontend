import registerOrganizationTool from './projects/organization-tool'
import registerInstructionTool from './projects/instruction-tool'
import registerSorbobotTool from './sorbobot/sorbobot-tool'
import registerProjectTool from './projects/project-tool'
import { McpServer } from '@modelcontextprotocol/server'
import registerSearchTool from './projects/search-tool'
import registerEventTool from './projects/event-tool'
import registerPeopleTool from './projects/user-tool'
import registerNewsTool from './projects/news-tool'
import registerSdgTool from './projects/sdg-tool'

// TODO people group member and project
// TODO org files
// TODO pagination of search results
// TODO output schemas

function createMCPServer() {
  // Create an MCP server
  const server = new McpServer({
    name: 'demo-server',
    version: '1.0.0',
  })

  // console.log(
  //   'Sorbobot config',
  //   'sorbobotApiUrl',
  //   !!sorbobotApiUrl,
  //   'sorbobotApiToken',
  //   !!sorbobotApiToken
  // )

  // registerLoginTool(server)

  registerSorbobotTool(server)

  registerSearchTool(server)

  registerSdgTool(server)

  registerProjectTool(server)

  registerPeopleTool(server)

  registerOrganizationTool(server)

  registerNewsTool(server)

  registerInstructionTool(server)

  registerEventTool(server)

  return server
}

export default createMCPServer
