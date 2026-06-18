import { mcpOptions, orgCode, resultFromTool } from './base'
import { getAllNews, getNews } from '~/api/news.service'
import type { TypeMcpServer } from '~/interfaces/mcp'
import type { NewsModel } from '~/models/news.model'
import { pick } from 'es-toolkit'
import { z } from 'zod'

const mapNewsArticle = (news: NewsModel) => ({
  item_type: 'news_article',
  ...pick(news, ['id', 'title', 'content', 'publication_date']),
})

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'news-list',
    {
      title: 'News list',
      description: 'Get a list of recent news articles.',
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
      inputSchema: { slugOrId: z.number().describe('The id of the news article') },
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
