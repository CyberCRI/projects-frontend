import { z } from 'zod'
import { mcpFetch, API_BASE_URL, orgCode } from './base'
import { PROJECT_PREVIEW_OUTPUT_SCHEMA, mapProjectPreview } from './project-tool'

export default (server) => {
  // Add an search tool
  server.registerTool(
    'organization-data',
    {
      title: 'Organization general data',
      description:
        'Get main general data about the platform organization such as its  description, title and terms and conditions. ',
      inputSchema: {},
      outputSchema: {
        organization_data: z
          .object({
            id: z.number().describe('The ID of the organization'),
            code: z.string().describe('The code of the organization'),
            terms_and_conditions: z
              .string()
              .describe('The terms and conditions of the organization'),
            name: z.string().describe('The name of the organization'),
            contact_email: z.string().nullable().describe('The contact email of the organization'),
            dashboard_title: z
              .string()
              .nullable()
              .describe('The dashboard title of the organization'),
            dashboard_subtitle: z
              .string()
              .nullable()
              .describe('The dashboard subtitle of the organization'),
            description: z.string().nullable().describe('The description of the organization'),
            website_url: z.string().nullable().describe('The website URL of the organization'),
          })
          .describe('The organization general data'),
      },
    },
    async (_input, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}organization/${orgCode}/`,
          {},
          extras
        )
        const org = queryResult
        results = {
          id: org.id,
          code: org.code,
          terms_and_conditions: org.terms_and_conditions?.displayed_content || '',
          name: org.name,
          contact_email: org.contact_email,
          dashboard_title: org.dashboard_title,
          dashboard_subtitle: org.dashboard_subtitle,
          description: org.description,
          website_url: org.website_url,
        }
      } catch (error) {
        console.error('Error fetching organization general data:', error)
      }
      const output = { organization_data: results }
      // console.log('MCP TOOL CALLED: organization-general-data', { output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )

  // Add an search tool
  server.registerTool(
    'organization-featured-projects',
    {
      title: 'Organization featured projects',
      description: 'Get a list of featured projects for the platform organization.',
      inputSchema: {},
      outputSchema: {
        results: z.array(PROJECT_PREVIEW_OUTPUT_SCHEMA).describe('The list of featured projects'),
      },
    },
    async (_input, extras) => {
      let results = {}
      try {
        const queryResult: any = await mcpFetch(
          // TODO: use org code from config
          `${API_BASE_URL}organization/${orgCode}/featured-projects/`,
          {},
          extras
        )
        results = queryResult.results.map((p: any) => mapProjectPreview(p))
      } catch (error) {
        console.error('Error fetching organization featured projects:', error)
      }
      const output = { results }
      // console.log('MCP TOOL CALLED: organization-featured-projects', { output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )
}
