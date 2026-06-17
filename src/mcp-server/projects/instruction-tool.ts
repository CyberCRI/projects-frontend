import { getAllInstructions, getInstruction } from '~/api/instruction.service'
import type { InstructionModel } from '~/models/instruction.model'
import { mcpOptions, orgCode, resultFromTool } from './base'
import type { TypeMcpServer } from '~/interfaces/mcp'
// import N from './zod-schema-utils'
import { z } from 'zod'

/*
const INSTRUCTION_ARTICLE_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the instruction article'),
  slug: N.string().describe('The slug of the instruction article'),
  title: N.string().describe('The title of the instruction article'),
  content: N.string().describe('The content of the instruction article'),
  publication_date: N.string().describe('The publication date of the instruction article'),
  item_type: z
    .literal('instruction_article')
    .describe('The type of the item, always instruction_article'),
})
*/

const mapInstructionArticle = (i: InstructionModel) => ({
  id: i.id,
  title: i.title,
  content: i.content,
  publication_date: i.publication_date,
  item_type: 'instruction_article',
})

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'instructions-list',
    {
      title: 'Instructions list',
      description: 'Get a list of instructions  .',
      inputSchema: {},
      /*outputSchema: {
        results: z
          .array(INSTRUCTION_ARTICLE_OUTPUT_SCHEMA)
          .describe('The list of instruction articles'),
          },*/
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
      /*outputSchema: {
        instruction_data: INSTRUCTION_ARTICLE_OUTPUT_SCHEMA.describe(
          'The instruction article data'
        ),
        },*/
    },
    resultFromTool(({ slugOrId }, extras) => {
      const opts = mcpOptions(extras)
      return getInstruction(orgCode, slugOrId, opts).then((article) =>
        mapInstructionArticle(article)
      )
    })
  )
}
