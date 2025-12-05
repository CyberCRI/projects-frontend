import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import registerEventTool from './projects/event-tool'
import registerInstructionTool from './projects/instruction-tool'
import registerNewsTool from './projects/news-tool'
import registerOrganizationTool from './projects/organization-tool'
import registerSdgTool from './projects/sdg-tool'
import registerPeopleTool from './projects/people-tool'
import registerProjectTool from './projects/project-tool'
import { default as registerSorbobotTool, sorbobotIsEnabled } from './sorbobot/sorbobot-tool'
import registerSearchTool from './projects/search-tool'

// TODO people group member and project
// TODO org files
// TODO pagination of search results
// TODO output schemas

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

if (sorbobotIsEnabled) {
  registerSorbobotTool(server)
}

registerSearchTool(server)

registerSdgTool(server)

registerProjectTool(server)

registerPeopleTool(server)

registerOrganizationTool(server)

registerNewsTool(server)

registerInstructionTool(server)

registerEventTool(server)

export default server
