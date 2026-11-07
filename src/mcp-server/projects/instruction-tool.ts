import { getAllInstructions, getInstruction } from 'shared-projects-frontend/apis'
import type { InstructionModel } from 'shared-projects-frontend/models'
import type { McpServer } from '@modelcontextprotocol/server'
import { mcpOptions, orgCode, resultFromTool } from './base'
import { pick } from 'es-toolkit'
import { z } from 'zod'

const mapInstructionArticle = (instruction: InstructionModel) => ({
  item_type: 'instruction_article',
  ...pick(instruction, ['id', 'title', 'content', 'publication_date']),
})

export default (server: McpServer) => {
  // Add an search tool
  server.registerTool(
    'instructions-list',
    {
      title: 'Instructions list',
      description: 'Get a list of instructions  .',
    },
    resultFromTool((_, ctx) => {
      const opts = mcpOptions(ctx)
      return getAllInstructions(orgCode, opts).then((pages) =>
        pages.results.map(mapInstructionArticle)
      )
    })
  )

  // Add an search tool
  server.registerTool(
    'instruction-article',
    {
      title: 'Instruction data',
      description:
        'Get an instruction article. Use the instructions-list tool to get instruction ids.',
      inputSchema: z.object({
        slugOrId: z.string().describe('The slug or id of the instruction article'),
      }),
    },
    resultFromTool(({ slugOrId }, ctx) => {
      const opts = mcpOptions(ctx)
      return getInstruction(orgCode, slugOrId, opts).then((article) =>
        mapInstructionArticle(article)
      )
    })
  )
}
