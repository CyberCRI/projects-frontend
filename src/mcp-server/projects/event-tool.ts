import { z } from 'zod'
import N from './zod-schema-utils'
import { mcpFetch, API_BASE_URL, orgCode } from './base'

const EVENT_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the event'),
  slug: N.string().describe('The slug of the event'),
  title: N.string().describe('The title of the event'),
  content: N.string().describe('The content of the event'),
  event_date: N.string().describe('The date of the event'),
  item_type: N.literal('event').describe('The type of the item, always event'),
})

const mapEvent = (e: any) => ({
  id: e.id,
  slug: e.slug,
  title: e.title,
  content: e.content,
  event_date: e.event_date,
  item_type: 'event',
})

export default (server) => {
  // Add an search tool
  server.registerTool(
    'future-events-list',
    {
      title: 'Future Events list',
      description: 'Get a list of future events.',
      inputSchema: {},
      outputSchema: { results: z.array(EVENT_OUTPUT_SCHEMA).describe('The list of future events') },
    },
    async (_input, extras) => {
      // today date at midnight
      const todayZeroHour = new Date()
      todayZeroHour.setHours(0, 0, 0, 0)
      const params = {
        ordering: 'event_date',
        from_date: todayZeroHour.toISOString(),
      }
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}organization/${orgCode}/event/`,
          { params },
          extras
        )
        results = queryResult.results.map(mapEvent)
      } catch (error) {
        console.error('Error fetching organization future events list:', error)
      }
      const output = { results }
      console.log('MCP TOOL CALLED: future- events-list', { output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )

  // Add an search tool
  server.registerTool(
    'past-events-list',
    {
      title: 'Past Events list',
      description: 'Get a list of past events.',
      inputSchema: {},
      outputSchema: { results: z.array(EVENT_OUTPUT_SCHEMA).describe('The list of past events') },
    },
    async (_input, extras) => {
      // today date at midnight
      const todayZeroHour = new Date()
      todayZeroHour.setHours(0, 0, 0, 0)
      const params = {
        ordering: '-event_date',
        to_date: todayZeroHour.toISOString(),
      }
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}organization/${orgCode}/event/`,
          { params },
          extras
        )
        results = mapEvent(queryResult.results)
      } catch (error) {
        console.error('Error fetching organization past events list:', error)
      }
      const output = results
      console.log('MCP TOOL CALLED: past-events-list', { output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )
}
