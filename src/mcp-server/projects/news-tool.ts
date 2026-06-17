import { mcpOptions, orgCode, resultFromTool } from './base'
import { getAllNews, getNews } from '~/api/news.service'
import type { TypeMcpServer } from '~/interfaces/mcp'
import type { NewsModel } from '~/models/news.model'
// import N from './zod-schema-utils'
import { z } from 'zod'
/*
const NEWS_ARTICLE_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the news article'),
  slug: N.string().describe('The slug of the news article'),
  title: N.string().describe('The title of the news article'),
  content: N.string().describe('The content of the news article'),
  publication_date: N.string().describe('The publication date of the news article'),
  item_type: N.literal('news_article').describe('The type of the item, always news_article'),
})
*/

const mapNewsArticle = (n: NewsModel) => ({
  id: n.id,
  title: n.title,
  content: n.content,
  publication_date: n.publication_date,
  item_type: 'news_article',
})

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'news-list',
    {
      title: 'News list',
      description: 'Get a list of recent news articles.',
      inputSchema: {},
      /*outputSchema: {
        results: z.array(NEWS_ARTICLE_OUTPUT_SCHEMA).describe('The list of recent news articles'),
        },*/
    },
    resultFromTool((_, extras) => {
      const opts = mcpOptions(extras)
      return getAllNews(orgCode, {
        ...opts,
        query: {
          ordering: '-publication_date',
          limit: 30,
          to_date: new Date().toISOString(),
        },
      }).then((pages) => pages.results.map(mapNewsArticle))
    })
  )

  // Add an search tool
  server.registerTool(
    'news-article',
    {
      title: 'News data',
      description: 'Get a news article. Use the news-list tool to get news ids.',
      inputSchema: { slugOrId: z.string().describe('The slug or id of the news article') },
      /*outputSchema: {
        results: z.array(NEWS_ARTICLE_OUTPUT_SCHEMA).describe('The news article data'),
        },*/
    },
    resultFromTool(({ slugOrId }, extras) => {
      const opts = mcpOptions(extras)
      return getNews(orgCode, slugOrId, {
        ...opts,
        query: {
          ordering: '-publication_date',
          limit: 30,
          to_date: new Date().toISOString(),
        },
      }).then((article) => mapNewsArticle(article))
    })
  )
}
