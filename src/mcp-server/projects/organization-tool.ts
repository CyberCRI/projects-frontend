import { getFeaturedProjects, getOrganizationByCode } from '~/api/organizations.service'
import { mcpOptions, orgCode, resultFromTool } from './base'
import type { TypeMcpServer } from '~/interfaces/mcp'
import { mapProjectPreview } from './project-tool'

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'organization-data',
    {
      title: 'Organization general data',
      description:
        'Get main general data about the platform organization such as its  description, title and terms and conditions. ',
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
    },
    resultFromTool((_, extras) => {
      const opts = mcpOptions(extras)
      return getFeaturedProjects(orgCode, opts).then((pages) =>
        pages.results.map(mapProjectPreview)
      )
    })
  )
}
