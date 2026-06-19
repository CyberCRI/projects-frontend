import { getAllInstructions, getInstruction } from '~/api/instruction.service'
import type { InstructionModel } from '~/models/instruction.model'
import { mcpOptions, orgCode, resultFromTool } from './base'
import type { TypeMcpServer } from '~/interfaces/mcp'
import { pick } from 'es-toolkit'
import { z } from 'zod'

const mapInstructionArticle = (instruction: InstructionModel) => ({
  item_type: 'instruction_article',
  ...pick(instruction, ['id', 'title', 'content', 'publication_date']),
})

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'instructions-list',
    {
      title: 'Instructions list',
      description: 'Get a list of instructions  .',
    },
    resultFromTool((_, extras) => {
      const opts = mcpOptions(extras)
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
      inputSchema: { slugOrId: z.string().describe('The slug or id of the instruction article') },
    },
    resultFromTool(({ slugOrId }, extras) => {
      const opts = mcpOptions(extras)
      return getInstruction(orgCode, slugOrId, opts).then((article) =>
        mapInstructionArticle(article)
      )
    })
  )
}
