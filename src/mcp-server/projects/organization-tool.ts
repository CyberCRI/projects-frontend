import { getFeaturedProjects, getOrganizationByCode } from '~/api/organizations.service'
import { /*PROJECT_PREVIEW_OUTPUT_SCHEMA,*/ mapProjectPreview } from './project-tool'
import { mcpOptions, orgCode, resultFromTool } from './base'
import type { TypeMcpServer } from '~/interfaces/mcp'
// import N from './zod-schema-utils'
// import { z } from 'zod'

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'organization-data',
    {
      title: 'Organization general data',
      description:
        'Get main general data about the platform organization such as its  description, title and terms and conditions. ',
      inputSchema: {},
      /*outputSchema: {
        organization_data: N.object({
          id: N.number().describe('The ID of the organization'),
          code: N.string().describe('The code of the organization'),
          terms_and_conditions: N.string().describe('The terms and conditions of the organization'),
          name: N.string().describe('The name of the organization'),
          contact_email: N.string().nullable().describe('The contact email of the organization'),
          dashboard_title: N.string().describe('The dashboard title of the organization'),
          dashboard_subtitle: N.string().describe('The dashboard subtitle of the organization'),
          description: N.string().describe('The description of the organization'),
          website_url: N.string().describe('The website URL of the organization'),
        }).describe('The organization general data'),
      },*/
    },
    resultFromTool((_, extras) => {
      const opts = mcpOptions(extras)
      return getOrganizationByCode(orgCode, opts).then((orgnization) => ({
        item_type: 'organization',
        id: orgnization.id,
        code: orgnization.code,
        terms_and_conditions: orgnization.terms_and_conditions?.displayed_content || '',
        name: orgnization.name,
        contact_email: orgnization.contact_email,
        dashboard_title: orgnization.dashboard_title,
        dashboard_subtitle: orgnization.dashboard_subtitle,
        description: orgnization.description,
        website_url: orgnization.website_url,
      }))
    })
  )

  // Add an search tool
  server.registerTool(
    'organization-featured-projects',
    {
      title: 'Organization featured projects',
      description: 'Get a list of featured projects for the platform organization.',
      inputSchema: {},
      /*outputSchema: {
        results: z.array(PROJECT_PREVIEW_OUTPUT_SCHEMA).describe('The list of featured projects'),
        },*/
    },
    resultFromTool((_, extras) => {
      const opts = mcpOptions(extras)
      return getFeaturedProjects(orgCode, opts).then((pages) =>
        pages.results.map(mapProjectPreview)
      )
    })
  )
}
