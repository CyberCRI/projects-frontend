import { mcpOptions, orgCode, resultFromTool } from './base'
import type { TypeMcpServer } from '~/mcp-server/interface'
import type { EventModel } from '~/models/event.model'
import { getAllEvents } from '~/api/event.service'
import { nowDate } from '~/functs/date'
// import N from './zod-schema-utils'
// import { z } from 'zod'
/*
const EVENT_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the event'),
  slug: N.string().describe('The slug of the event'),
  title: N.string().describe('The title of the event'),
  content: N.string().describe('The content of the event'),
  start_date: N.string().describe('The start date of the event'),
  end_date: N.string().describe('The end date of the event'),
  item_type: N.literal('event').describe('The type of the item, always event'),
})
*/

const mapEvent = (e: EventModel) => ({
  id: e.id,
  title: e.title,
  content: e.content,
  start_date: e.start_date,
  end_date: e.end_date,
  item_type: 'event',
})

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'future-events-list',
    {
      title: 'Future Events list',
      description: 'Get a list of future events.',
      inputSchema: {},
      /*outputSchema: { results: z.array(EVENT_OUTPUT_SCHEMA).describe('The list of future events') },*/
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
      /*outputSchema: { results: z.array(EVENT_OUTPUT_SCHEMA).describe('The list of past events') },*/
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
