import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

const API_BASE_URL = 'https://api.projects.k8s.lp-i.dev/v1/'

const runtimeConfig = useRuntimeConfig()
const orgCode = runtimeConfig.public.appApiOrgCode
// Create an MCP server
const server = new McpServer({
  name: 'demo-server',
  version: '1.0.0',
})

// Add an search tool
server.registerTool(
  'search',
  {
    title: 'Search Tool',
    description: 'Search on the platform for projects, people and groups related to a query.',
    inputSchema: { query: z.string() },
    outputSchema: { results: z.array(z.any()) },
  },
  async ({ query }) => {
    let results = []
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}search/${encodeURIComponent(query)}/?limit=30&organizations=${orgCode}`
      )
      results = queryResult.results
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: search', { query, output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'project-general-data',
  {
    title: 'Project general data',
    description:
      'Get main general data about a project given its id or slug. To get the project id or slug, use the search tool with the project name, the project id or slug will be in the first result.',
    inputSchema: { idOrSlug: z.string() },
    outputSchema: { results: z.object({}) },
  },
  async ({ idOrSlug }) => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}project/${idOrSlug}/`
      )
      results = queryResult
    } catch (error) {
      console.error('Error fetching project general data:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: project-general-data', { idOrSlug, output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'project-similar',
  {
    title: 'Project similar projects',
    description:
      'Get projects that are similar to the one given by its id or slug. To get the project id or slug, use the search tool with the project name, the project id or slug will be in the first result.',
    inputSchema: { idOrSlug: z.string() },
    outputSchema: { results: z.object({}) },
  },
  async ({ idOrSlug }) => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}project/${idOrSlug}/similar/`
      )
      results = queryResult.results
    } catch (error) {
      console.error('Error fetching project similar projects:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: project-similar-projects', { idOrSlug, output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'project-blog-entries',
  {
    title: 'Project blog entries',
    description:
      'Get main blog entries about a project given its id or slug. To get the project id or slug, use the search tool with the project name, the project id or slug will be in the first result.',
    inputSchema: { idOrSlug: z.string() },
    outputSchema: { results: z.object({}) },
  },
  async ({ idOrSlug }) => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}project/${idOrSlug}/blog-entry/`
      )
      results = queryResult
    } catch (error) {
      console.error('Error fetching project blog entries:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: project-blog-entries', { idOrSlug, output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'project-blog-entry',
  {
    title: 'Project blog entries',
    description:
      'Get main blog entries about a project given its id or slug. To get the project id or slug, use the search tool with the project name, the project id or slug will be in the first result. You can get all blog entries of a project and their id using project-blog-entries tool.',
    inputSchema: { idOrSlug: z.string(), blogEntryId: z.string() },
    outputSchema: { results: z.object({}) },
  },
  async ({ idOrSlug, blogEntryId }) => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}project/${idOrSlug}/blog-entry/${blogEntryId}/`
      )
      results = queryResult.results
    } catch (error) {
      console.error('Error fetching project blog entry:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: project-blog-entry', { idOrSlug, output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'people-general-data',
  {
    title: 'People general data',
    description:
      'Get main general data about a people profile given its id or slug. To get the profile id or slug, use the search tool with the profile name, the profile id or slug will be in the first result.',
    inputSchema: { idOrSlug: z.string() },
    outputSchema: { results: z.object({}) },
  },
  async ({ idOrSlug }) => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}user/${idOrSlug}/`
      )
      results = queryResult
    } catch (error) {
      console.error('Error fetching profile general data:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: profile-general-data', { idOrSlug, output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'people-group-data',
  {
    title: 'People group data',
    description:
      'Get main general data about a people group given its id or slug. To get the group id or slug, use the search tool with the group name, the group id or slug will be in the first result.',
    inputSchema: { idOrSlug: z.string() },
    outputSchema: { results: z.object({}) },
  },
  async ({ idOrSlug }) => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}people-group/${idOrSlug}/`
      )
      results = queryResult
    } catch (error) {
      console.error('Error fetching group general data:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: people-group-data', { idOrSlug, output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'organization-data',
  {
    title: 'Organization general data',
    description: 'Get main general data about the platform organization. ',
    inputSchema: {},
    outputSchema: { results: z.object({}) },
  },
  async () => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/`
      )
      results = queryResult
    } catch (error) {
      console.error('Error fetching organization general data:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: organization-general-data', { output })
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
    outputSchema: { results: z.object({}) },
  },
  async () => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/featured-projects/`
      )
      results = queryResult.results
    } catch (error) {
      console.error('Error fetching organization featured projects:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: organization-featured-projects', { output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'news-list',
  {
    title: 'News list',
    description: 'Get a list of news articles.',
    inputSchema: {},
    outputSchema: { results: z.array(z.object({})) },
  },
  async () => {
    const params = { ordering: '-publication_date', limit: 30, to_date: new Date().toISOString() }
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/news/`,
        { params }
      )
      results = queryResult.results
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
    inputSchema: { slugOrId: z.string() },
    outputSchema: { results: z.array(z.object({})) },
  },
  async ({ slugOrId }) => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/news/${slugOrId}/`
      )
      results = queryResult.results
    } catch (error) {
      console.error('Error fetching organization news item:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: news-article', { output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'instructions-list',
  {
    title: 'Instructions list',
    description: 'Get a list of instructions  .',
    inputSchema: {},
    outputSchema: { results: z.array(z.object({})) },
  },
  async () => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/instruction/`
      )
      results = queryResult.results
    } catch (error) {
      console.error('Error fetching organization instructions list:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: instructions-list', { output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'instruction-article',
  {
    title: 'Instruction data',
    description:
      'Get an instruction article. Use the instructions-list tool to get instruction ids.',
    inputSchema: { slugOrId: z.string() },
    outputSchema: { results: z.array(z.object({})) },
  },
  async ({ slugOrId }) => {
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/instruction/${slugOrId}/`
      )
      results = queryResult.results
    } catch (error) {
      console.error('Error fetching organization instruction item:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: instruction-article', { output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'future-events-list',
  {
    title: 'Future Events list',
    description: 'Get a list of future events.',
    inputSchema: {},
    outputSchema: { results: z.array(z.object({})) },
  },
  async () => {
    // today date at midnight
    const todayZeroHour = new Date()
    todayZeroHour.setHours(0, 0, 0, 0)
    const params = {
      ordering: 'event_date',
      from_date: todayZeroHour.toISOString(),
    }
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/event/`,
        { params }
      )
      results = queryResult.results
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
    outputSchema: { results: z.array(z.object({})) },
  },
  async () => {
    // today date at midnight
    const todayZeroHour = new Date()
    todayZeroHour.setHours(0, 0, 0, 0)
    const params = {
      ordering: '-event_date',
      to_date: todayZeroHour.toISOString(),
    }
    let results = {}
    try {
      const queryResult: any = await $fetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/event/`,
        { params }
      )
      results = queryResult.results
    } catch (error) {
      console.error('Error fetching organization past events list:', error)
    }
    const output = { results }
    console.log('MCP TOOL CALLED: past-events-list', { output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

export default server
