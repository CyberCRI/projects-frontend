import { z } from 'zod'
import N from './zod-schema-utils'
import { mcpFetch, API_BASE_URL, orgCode } from './base'

const NEWS_ARTICLE_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the news article'),
  slug: N.string().describe('The slug of the news article'),
  title: N.string().describe('The title of the news article'),
  content: N.string().describe('The content of the news article'),
  publication_date: N.string().describe('The publication date of the news article'),
  item_type: N.literal('news_article').describe('The type of the item, always news_article'),
})

const mapNewsArticle = (n: any) => ({
  id: n.id,
  slug: n.slug,
  title: n.title,
  content: n.content,
  publication_date: n.publication_date,
  item_type: 'news_article',
})

export default (server) => {
  // Add an search tool
  server.registerTool(
    'news-list',
    {
      title: 'News list',
      description: 'Get a list of recent news articles.',
      inputSchema: {},
      outputSchema: {
        results: z.array(NEWS_ARTICLE_OUTPUT_SCHEMA).describe('The list of recent news articles'),
      },
    },
    async (_input, extras) => {
      const params = { ordering: '-publication_date', limit: 30, to_date: new Date().toISOString() }
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}organization/${orgCode}/news/`,
          { params },
          extras
        )
        results = queryResult.results.map(mapNewsArticle)
      } catch (error) {
        console.error('Error fetching organization news list:', error)
      }
      const output = { results }
      console.log('MCP TOOL CALLED: news-list', { output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )

  // Add an search tool
  server.registerTool(
    'news-article',
    {
      title: 'News data',
      description: 'Get a news article. Use the news-list tool to get news ids.',
      inputSchema: { slugOrId: z.string().describe('The slug or id of the news article') },
      outputSchema: {
        results: z.array(NEWS_ARTICLE_OUTPUT_SCHEMA).describe('The news article data'),
      },
    },
    async ({ slugOrId }, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}organization/${orgCode}/news/${slugOrId}/`,
          {},
          extras
        )
        results = mapNewsArticle(queryResult.results)
      } catch (error) {
        console.error('Error fetching organization news item:', error)
      }
      const output = results
      console.log('MCP TOOL CALLED: news-article', { output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )
}
