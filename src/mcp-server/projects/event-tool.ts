import type { EventModel } from 'shared-projects-frontend/models'
import { getAllEvents } from 'shared-projects-frontend/apis'
import { mcpOptions, orgCode, resultFromTool } from './base'
import type { TypeMcpServer } from '~/interfaces/mcp'
import { nowDate } from '~/functs/date'
import { pick } from 'es-toolkit'

const mapEvent = (event: EventModel) => ({
  item_type: 'event',
  ...pick(event, ['id', 'title', 'content', 'start_date', 'end_date']),
})

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'future-events-list',
    {
      title: 'Future Events list',
      description: 'Get a list of future events.',
      inputSchema: {},
    },
    resultFromTool((_, extras) => {
      const todayZeroHour = nowDate()
      const opts = mcpOptions(extras)
      return getAllEvents(orgCode, {
        ...opts,
        query: {
          ordering: 'start_date',
          from_date: todayZeroHour.toISOString(),
        },
      }).then((response) => response.results.map(mapEvent))
    })
  )

  // Add an search tool
  server.registerTool(
    'past-events-list',
    {
      title: 'Past Events list',
      description: 'Get a list of past events.',
      inputSchema: {},
    },
    resultFromTool((_, extras) => {
      const todayZeroHour = nowDate()
      const opts = mcpOptions(extras)
      return getAllEvents(orgCode, {
        ...opts,
        query: {
          ordering: '-start_date',
          from_date: todayZeroHour.toISOString(),
        },
      }).then((response) => response.results.map(mapEvent))
    })
  )
}
