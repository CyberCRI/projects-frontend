import { getAllNews, getNews } from 'shared-projects-frontend/apis'
import type { NewsModel } from 'shared-projects-frontend/models'
import type { McpServer } from '@modelcontextprotocol/server'
import { mcpOptions, orgCode, resultFromTool } from './base'
import { pick } from 'es-toolkit'
import { z } from 'zod'

const mapNewsArticle = (news: NewsModel) => ({
  item_type: 'news_article',
  ...pick(news, ['id', 'title', 'content', 'publication_date']),
})

export default (server: McpServer) => {
  // Add an search tool
  server.registerTool(
    'news-list',
    {
      title: 'News list',
      description: 'Get a list of recent news articles.',
    },
    resultFromTool((_, ctx) => {
      const opts = mcpOptions(ctx)
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
      inputSchema: z.object({
        slugOrId: z.number().describe('The id of the news article'),
      }),
    },
    resultFromTool(({ slugOrId }, ctx) => {
      const opts = mcpOptions(ctx)
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
