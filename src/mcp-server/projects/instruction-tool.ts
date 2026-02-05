import { z } from 'zod'
import N from './zod-schema-utils'
import { mcpFetch, API_BASE_URL, orgCode } from './base'

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

const mapInstructionArticle = (i: any) => ({
  id: i.id,
  slug: i.slug,
  title: i.title,
  content: i.content,
  publication_date: i.publication_date,
  item_type: 'instruction_article',
})

export default (server) => {
  // Add an search tool
  server.registerTool(
    'instructions-list',
    {
      title: 'Instructions list',
      description: 'Get a list of instructions  .',
      inputSchema: {},
      outputSchema: {
        results: z
          .array(INSTRUCTION_ARTICLE_OUTPUT_SCHEMA)
          .describe('The list of instruction articles'),
      },
    },
    async (_input, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}organization/${orgCode}/instruction/`,
          {},
          extras
        )
        results = queryResult.results.map(mapInstructionArticle)
      } catch (error) {
        console.error('Error fetching organization instructions list:', error)
      }
      const output = { results }
      console.log('MCP TOOL CALLED: instructions-list', { output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )

  // Add an search tool
  server.registerTool(
    'instruction-article',
    {
      title: 'Instruction data',
      description:
        'Get an instruction article. Use the instructions-list tool to get instruction ids.',
      inputSchema: { slugOrId: z.string().describe('The slug or id of the instruction article') },
      outputSchema: {
        instruction_data: INSTRUCTION_ARTICLE_OUTPUT_SCHEMA.describe(
          'The instruction article data'
        ),
      },
    },
    async ({ slugOrId }, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}organization/${orgCode}/instruction/${slugOrId}/`,
          {},
          extras
        )
        results = mapInstructionArticle(queryResult.results)
      } catch (error) {
        console.error('Error fetching organization instruction item:', error)
      }
      const output = results
      console.log('MCP TOOL CALLED: instruction-article', { output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )
}
