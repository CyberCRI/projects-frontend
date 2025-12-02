import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import SorbobotAPI from '@/mcp-server/sorbobot/sorbobot-api.js'
import { tokenMap, traceMcp, traceSorbobot } from '@/server/routes/api/chat-stream'

// TODO people group member and project
// TODO org files
// TODO pagination of search results
// TODO output schemas

const runtimeConfig = useRuntimeConfig()

function getUserToken(extras) {
  const convesrationId = (extras.requestInfo.headers['authorization'] || '').replace('Bearer ', '')
  traceMcp('Tool Getting user token for conversationId', convesrationId)
  const tokenEntry = tokenMap.get(convesrationId)
  if (tokenEntry) {
    traceMcp('MCP tool found token for conversationId', tokenEntry.token.substring(0, 6) + '...')
    return tokenEntry.token
  } else {
    traceMcp('MCP tool no token found for conversationId', convesrationId)
  }
  return null
}

function mcpFetch(url: string, options: any, extras: any = {}) {
  const _options = options || {}
  const accessToken = getUserToken(extras)
  if (accessToken) {
    if (!_options.headers) {
      _options.headers = {}
    }
    _options.headers['Authorization'] = `Bearer ${accessToken}`
  }
  return $fetch(url, _options)
}

const orgCode = runtimeConfig.public.appApiOrgCode

const API_BASE_URL =
  runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/'
// Create an MCP server
const server = new McpServer({
  name: 'demo-server',
  version: '1.0.0',
})

let sorbobotApi: SorbobotAPI | null = null
const sorbobotApiUrl = runtimeConfig.public.appSorbobotApiUrl
const sorbobotApiToken = runtimeConfig.appSorbobotApiToken
// console.log(
//   'Sorbobot config',
//   'sorbobotApiUrl',
//   !!sorbobotApiUrl,
//   'sorbobotApiToken',
//   !!sorbobotApiToken
// )

let SORBOBOT_EXTRA = ''
if (sorbobotApiUrl && sorbobotApiToken) {
  sorbobotApi = new SorbobotAPI(sorbobotApiToken, sorbobotApiUrl)
  SORBOBOT_EXTRA =
    "If the query is about researchers, research topics, parpers or publications use the 'sorbobot-api' in priority."
  console.log('Sorbobot API initialized')
  // console.log('Registering Sorbobot API tool')

  async function resolveResearcherProfile(sorbobotResults, extras) {
    // map researchers to their profile in Projects
    traceSorbobot('Resolving researcher profiles from Sorbobot results')
    traceSorbobot('SorbobotResults:', sorbobotResults)
    const researcherEppn = Object.values(sorbobotResults)
      .map((researcher: any) => researcher.id)
      .filter((id) => !!id)
      .map((id) => ('' + id).split('@')[0]) // get local part of eppn only)
    const idSource = 'local' // 'eppn'
    const offset = '0'
    let idMap = {}
    try {
      const profileResponse: any = await mcpFetch(
        `${API_BASE_URL}crisalid/researcher/search/?`,
        {
          query: {
            harvester: idSource,
            offset: offset,
            values: researcherEppn.join(','),
          },
        },
        extras
      )
      traceSorbobot('Profile response from sorbobots extender in MCP:', profileResponse)
      idMap = profileResponse.results || {}
    } catch (error) {
      console.error('Error fetching projects researcher profiles from MCP:', error)
    }
    const sorbobotResultsWithProfiles = Object.values(sorbobotResults).map((researcher: any) => {
      const res = researcher
      const resarecherId = researcher.id || ''
      const localEppn = resarecherId.split('@')[0]
      const profile = idMap[localEppn]
      const user = profile?.user
      if (user) {
        res['id'] = user.id
        res['slug'] = user.slug
        res['link_url'] = `/profile/${user.slug}/`
      } else {
        delete res['id']
      }
      return res
    })
    traceSorbobot('Sorbobot results with profiles:', sorbobotResultsWithProfiles)
    return sorbobotResultsWithProfiles
  }

  const sorbobotRewriteTopics = (topics) => {
    const topicSet = new Set()
    for (const topic of topics || []) {
      const t = topic.split('/')
      if (t.length < 2) continue // skip "root"
      let topicName = t[t.length - 1].replace(/^-/, ' ').trim()
      if (t.length > 2) topicName += ` (${t[t.length - 2].replace(/^-/, ' ').trim()})`
      topicSet.add(topicName)
    }
    return Array.from(topicSet)
  }
  // Add an search tool
  server.registerTool(
    'sorbobot-api',
    {
      title: 'Research, researchers, experts and science topics and publication finder',
      description:
        'Get a list of researchers and their research papers based on a query. Also get a list of research topics. Use this tool in priority if it is relevant to the user question.',
      inputSchema: { queryPrompt: z.string().describe('The research query prompt') },
      outputSchema: {
        researchers: z.array(z.object({}).describe('A researcher object')),
        research_topics: z.array(z.string().describe('A research topic')),
      },
    },
    async ({ queryPrompt }, extras) => {
      let results = { researchers: [], research_topics: [] }
      if (!sorbobotApi) {
        console.log('Sorbobot API not initialized')
        return results
      }
      try {
        await sorbobotApi.init()
        const sorbobotResults = await sorbobotApi.query(queryPrompt)
        await sorbobotApi.close()
        const researchers = await resolveResearcherProfile(sorbobotResults?.authors || [], extras)
        results = {
          researchers: researchers,
          research_topics: sorbobotRewriteTopics(sorbobotResults.search_results),
        }
      } catch (error) {
        console.error('Error querying Sorbobot:', error)
      }
      const output = results
      // console.log('MCP TOOL CALLED: sorbobot-api', { output })
      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      }
    }
  )
}

const FETCH_PROJECT_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the project, use the search tool with the project name, the project id or slug will be in the first result, else use the previously mentioned slug or id.'

const FETCH_USER_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the user / profile / person / member, use the search tool with the user / profile / person / member  firstname and lastname, the user / profile / person / member id or slug will be in the first result, else use the previously mentioned slug or id.'

const FETCH_GROUP_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the group of users, use the search tool with the group of user name, the group id or slug will be in the first result, else use the previously mentioned slug or id.'

// generated by perplexity
const ALL_SDGS = [
  { id: 1, title: 'No poverty', description: 'End poverty in all its forms everywhere.' },
  {
    id: 2,
    title: 'Zero hunger',
    description:
      'End hunger, achieve food security and improved nutrition and promote sustainable agriculture.',
  },
  {
    id: 3,
    title: 'Good health and well-being',
    description: 'Ensure healthy lives and promote well-being for all at all ages.',
  },
  {
    id: 4,
    title: 'Quality education',
    description:
      'Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.',
  },
  {
    id: 5,
    title: 'Gender equality',
    description: 'Achieve gender equality and empower all women and girls.',
  },
  {
    id: 6,
    title: 'Clean water and sanitation',
    description: 'Ensure availability and sustainable management of water and sanitation for all.',
  },
  {
    id: 7,
    title: 'Affordable and clean energy',
    description: 'Ensure access to affordable, reliable, sustainable and modern energy for all.',
  },
  {
    id: 8,
    title: 'Decent work and economic growth',
    description:
      'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.',
  },
  {
    id: 9,
    title: 'Industry, innovation and infrastructure',
    description:
      'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.',
  },
  {
    id: 10,
    title: 'Reduced inequalities',
    description: 'Reduce inequality within and among countries.',
  },
  {
    id: 11,
    title: 'Sustainable cities and communities',
    description: 'Make cities and human settlements inclusive, safe, resilient and sustainable.',
  },
  {
    id: 12,
    title: 'Responsible consumption and production',
    description: 'Ensure sustainable consumption and production patterns.',
  },
  {
    id: 13,
    title: 'Climate action',
    description: 'Take urgent action to combat climate change and its impacts.',
  },
  {
    id: 14,
    title: 'Life below water',
    description:
      'Conserve and sustainably use the oceans, seas and marine resources for sustainable development.',
  },
  {
    id: 15,
    title: 'Life on land',
    description:
      'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.',
  },
  {
    id: 16,
    title: 'Peace, justice and strong institutions',
    description:
      'Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.',
  },
  {
    id: 17,
    title: 'Partnerships for the goals',
    description:
      'Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.',
  },
].map((sdg) => ({
  ...sdg,
  item_image: `${runtimeConfig.public.appPublicBinariesPrefix}/sdgs/en/${sdg.id}.svg`,
  item_type: 'sdg',
}))

const NEWS_ARTICLE_OUTPUT_SCHEMA = z.object({
  id: z.number().describe('The ID of the news article'),
  slug: z.string().describe('The slug of the news article'),
  title: z.string().describe('The title of the news article'),
  content: z.string().describe('The content of the news article'),
  publication_date: z.string().describe('The publication date of the news article'),
  item_type: z.literal('news_article').describe('The type of the item, always news_article'),
})

const mapNewsArticle = (n: any) => ({
  id: n.id,
  slug: n.slug,
  title: n.title,
  content: n.content,
  publication_date: n.publication_date,
  item_type: 'news_article',
})

const INSTRUCTION_ARTICLE_OUTPUT_SCHEMA = z.object({
  id: z.number().describe('The ID of the instruction article'),
  slug: z.string().describe('The slug of the instruction article'),
  title: z.string().describe('The title of the instruction article'),
  content: z.string().describe('The content of the instruction article'),
  publication_date: z.string().describe('The publication date of the instruction article'),
  item_type: z
    .literal('instruction_article')
    .describe('The type of the item, always instruction_article'),
})

const mapInstructionArticle = (i: any) => ({
  id: i.id,
  slug: i.slug,
  title: i.title,
  content: i.content,
  publication_date: i.publication_date,
  item_type: 'instruction_article',
})

const EVENT_OUTPUT_SCHEMA = z.object({
  id: z.number().describe('The ID of the event'),
  slug: z.string().describe('The slug of the event'),
  title: z.string().describe('The title of the event'),
  content: z.string().describe('The content of the event'),
  event_date: z.string().describe('The date of the event'),
  item_type: z.literal('event').describe('The type of the item, always event'),
})

const mapEvent = (e: any) => ({
  id: e.id,
  slug: e.slug,
  title: e.title,
  content: e.content,
  event_date: e.event_date,
  item_type: 'event',
})

const mapSDG = (s: any) => {
  return ALL_SDGS[s] || { id: s }
}

const CATEGORY_PREVIEW_OUTPUT_SCHEMA = z.object({
  id: z.number().describe('The ID of the category'),
  slug: z.string().describe('The slug of the category'),
  name: z.string().describe('The name of the category'),
  item_type: z.literal('category').describe('The type of the item, always category'),
  link_url: z.string().describe('The URL link to the category'),
})
const categoryMapper = (c: any) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  link_url: `/categories/${c.slug}/`,
  item_type: 'category',
})

const tagMapper = (t: any) => ({ id: t.id, title: t.title, description: t.description })

const PROJECT_PREVIEW_OUTPUT_SCHEMA = z.object({
  id: z.string().describe('The ID of the project'),
  slug: z.string().describe('The slug of the project'),
  item_type: z.literal('project').describe('The type of the item, always project'),
  title: z.string().describe('The title of the project'),
  purpose: z.string().describe('The purpose of the project'),
  categories: z
    .array(CATEGORY_PREVIEW_OUTPUT_SCHEMA)
    .describe('The list of categories of the project'),
  link_url: z.string().describe('The URL link to the project'),
  item_image: z.string().nullable().describe('The image URL of the project'),
})

const mapProjectPreview = (p: any) => ({
  id: p.id,
  slug: p.slug,
  item_type: 'project',
  title: p.title,
  purpose: p.purpose,
  categories: (p.categories || []).map(categoryMapper),
  link_url: `/projects/${p.slug}/`,
  item_image: p.header_image?.variations?.small,
})

const USER_PREVIEW_OUTPUT_SCHEMA = z.object({
  id: z.number().optional().nullable().describe('The ID of the user'),
  slug: z.string().optional().nullable().describe('The slug of the user'),
  item_type: z.literal('user').describe('The type of the item, always user'),
  given_name: z.string().optional().nullable().describe('The given name of the user'),
  family_name: z.string().optional().nullable().describe('The family name of the user'),
  job: z.string().optional().nullable().nullable().describe('The job or title of the user'),
  email: z.string().optional().nullable().describe('The email of the user'),
  link_url: z.string().optional().nullable().describe('The URL link to the user profile'),
  item_image: z.string().optional().nullable().describe('The image URL of the user profile'),
})

const mapUserPreview = (u: any) => ({
  id: u.id,
  slug: u.slug,
  item_type: 'user',
  given_name: u.given_name,
  family_name: u.family_name,
  job: u.job,
  email: u.email,
  link_url: `/profile/${u.slug}/`,
  item_image: u.profile_picture?.variations?.small,
})

const PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA = z.object({
  id: z.number().optional().nullable().describe('The ID of the people group'),
  slug: z.string().optional().nullable().describe('The slug of the people group'),
  item_type: z.literal('people_group').describe('The type of the item, always people_group'),
  name: z.string().describe('The name of the people group'),
  short_description: z
    .string()
    .optional()
    .nullable()
    .describe('The short description of the people group'),
  description: z.string().optional().nullable().describe('The description of the people group'),
  email: z.string().optional().nullable().describe('The email of the people group'),
  member_count: z
    .number()
    .optional()
    .nullable()
    .describe('The number of members in the people group'),
  link_url: z.string().optional().nullable().describe('The URL link to the people group'),
  item_image: z.string().optional().nullable().describe('The image URL of the people group'),
})

const mapPeopleGroupPreview = (g: any) => ({
  id: g.id,
  slug: g.slug,
  item_type: 'people_group',
  name: g.name,
  short_description: g.short_description,
  description: g.description,
  email: g.email,
  member_count: g.member_count,
  link_url: `/group/${g.slug}/`,
  item_image: g.header_image?.variations?.small,
})

const mapBlogEntry = (b: any) => ({
  id: b.id,
  title: b.title,
  content: b.content,
})

const SDG_OUTPUT_SCHEMA = z.object({
  id: z.number().describe('The ID of the Sustainable Development Goal (SDG)'),
  title: z.string().describe('The title of the Sustainable Development Goal (SDG)'),
  description: z.string().describe('The description of the Sustainable Development Goal (SDG)'),
  item_image: z.string().describe('The image URL of the Sustainable Development Goal (SDG)'),
  item_type: z.literal('sdg').describe('The type of the item, always sdg'),
})

// Add an search tool
server.registerTool(
  'all-sdgs',
  {
    title: 'LList of all SDGs Sustainable Development Goals',
    description: 'Get name, description and id of all SDGs Sustainable Development Goals.',
    inputSchema: {},
    outputSchema: {
      results: z.array(SDG_OUTPUT_SCHEMA),
    },
  },
  async function () {
    console.log('foo')
    const output = { results: ALL_SDGS }
    // console.log('MCP TOOL CALLED: search', { query, output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

server.registerTool(
  'sdgById',
  {
    title: 'LList of all SDGs Sustainable Development Goals',
    description: 'Get name, description and id of all SDGs Sustainable Development Goals.',
    inputSchema: {
      sdgId: z
        .number()
        .describe('The ID of the Sustainable Development Goal (SDG) between 1 and 17'),
    },
    outputSchema: { results: SDG_OUTPUT_SCHEMA },
  },
  async ({ sdgId }) => {
    let results: any = {}
    try {
      results = ALL_SDGS[sdgId] || 'SDG not found'
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
    const output = results
    // console.log('MCP TOOL CALLED: search', { query, output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)

// Add an search tool
server.registerTool(
  'search',
  {
    title: 'Search Tool',
    description: `Search on the platform for projects, people profile (user) and groups (of users) related to a query. ${SORBOBOT_EXTRA}`,
    inputSchema: { queryTerms: z.string().describe('The search query terms') },
    outputSchema: {
      results: z
        .array(
          z.union([
            PROJECT_PREVIEW_OUTPUT_SCHEMA,
            USER_PREVIEW_OUTPUT_SCHEMA,
            PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA,
          ])
        )
        .describe('The list of search results'),
    },
  },
  async ({ queryTerms }, extras) => {
    let results = []
    try {
      const query = {
        limit: 12,
        organizations: [orgCode],
      }
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}search/${encodeURIComponent(queryTerms)}/?limit=30&organizations=${orgCode}`,
        { query },
        extras
      )
      results = queryResult.results.map((item) => {
        if (item.type === 'project') {
          const p = item.project
          return mapProjectPreview(p)
        } else if (item.type === 'user') {
          const u = item.user
          return mapUserPreview(u)
        } else if (item.type === 'people_group') {
          const g = item.people_group
          return mapPeopleGroupPreview(g)
        }
      })
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
    const output = { results } // skip pagination for simplicity
    // console.log('MCP TOOL CALLED: search', { query, output })
    return {
      content: [{ type: 'text', text: JSON.stringify(output) }],
      structuredContent: output,
    }
  }
)
const BLOG_ENTRY_OUTPUT_SCHEMA = z.object({
  id: z.number().describe('The ID of the blog entry'),
  title: z.string().describe('The title of the blog entry'),
  content: z.string().describe('The content of the blog entry'),
})

// Add an search tool
server.registerTool(
  'project-general-data',
  {
    title: 'Project general data',
    description: `Get main general data (description, goals, blog entries, members...) about a project given its id or slug. ${FETCH_PROJECT_SLUG_OR_ID}`,
    inputSchema: { idOrSlug: z.string().describe('The id or slug of the project') },
    outputSchema: {
      project_data: PROJECT_PREVIEW_OUTPUT_SCHEMA.extend({
        purpose: z.string().describe('The purpose of the project'),
        description: z.string().nullable().describe('The description of the project'),
        sdgs: z.array(SDG_OUTPUT_SCHEMA).describe('The list of SDGs related to the project'),
        tags: z
          .array(z.object({ id: z.number(), title: z.string(), description: z.string() }))
          .describe('The list of tags of the project'),
        goals: z
          .array(
            z.object({
              id: z.number(),
              title: z.string().describe('The title of the goal'),
              description: z.string().describe('The description of the goal'),
              status: z.string().describe('The status of the goal'),
            })
          )
          .describe('The list of goals of the project'),
        reviews: z
          .array(
            z.object({
              title: z.string().describe('The title of the review'),
              description: z.string().describe('The description of the review'),
              reviewer: USER_PREVIEW_OUTPUT_SCHEMA.nullable().describe(
                'The reviewer of the review'
              ),
            })
          )
          .describe('The list of reviews of the project'),
        locations: z
          .array(
            z.object({
              id: z.number(),
              title: z.string().describe('The title of the location'),
              description: z.string().describe('The description of the location'),
              type: z.string().describe('The type of the location'),
              lat: z.number().describe('The latitude of the location'),
              lng: z.number().describe('The longitude of the location'),
            })
          )
          .describe('The list of locations of the project'),
        announcements: z
          .array(
            z.object({
              id: z.number(),
              title: z.string().describe('The title of the announcement'),
              description: z.string().describe('The description of the announcement'),
              status: z.string().describe('The status of the announcement'),
              deadline: z.string().nullable().describe('The deadline of the announcement'),
              is_remunerated: z.boolean().describe('Whether the announcement is remunerated'),
            })
          )
          .describe('The list of announcements of the project'),
        links: z
          .array(
            z.object({
              id: z.number(),
              title: z.string().describe('The title of the link'),
              category: z.string(),
              description: z.string().describe('The description of the link'),
              site_name: z.string(),
              site_url: z.string(),
            })
          )
          .describe('The list of links of the project'),
        files: z
          .array(
            z.object({
              id: z.number(),
              title: z.string().describe('The title of the file'),
              description: z.string().describe('The description of the file'),
              file: z.string(),
              mime: z.string(),
            })
          )
          .describe('The list of files of the project'),
        blog_entries: z
          .array(BLOG_ENTRY_OUTPUT_SCHEMA)
          .describe('The list of blog entries of the project'),
        linked_projects: z
          .array(PROJECT_PREVIEW_OUTPUT_SCHEMA)
          .describe('The list of linked projects of the project'),
        views: z.number().describe('The number of views of the project'),
        team: z.object({
          members: z
            .array(USER_PREVIEW_OUTPUT_SCHEMA)
            .describe('The list of team members of the project'),
          owners: z
            .array(USER_PREVIEW_OUTPUT_SCHEMA)
            .describe('The list of team owners of the project'),
          reviewers: z
            .array(USER_PREVIEW_OUTPUT_SCHEMA)
            .describe('The list of team reviewers of the project'),
          member_groups: z
            .array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA)
            .describe('The list of team member groups of the project'),
          owner_groups: z
            .array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA)
            .describe('The list of team owner groups of the project'),
          reviewer_groups: z
            .array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA)
            .describe('The list of team reviewer groups of the project'),
        }),
      }),
    },
  },
  async ({ idOrSlug }, extras) => {
    let results = {}
    try {
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}project/${idOrSlug}/`,
        {},
        extras
      )
      const p = queryResult
      results = {
        item_type: 'project',
        link_url: `/projects/${p.slug}/`,
        id: p.id,
        item_image: p.header_image?.variations?.small,
        slug: p.slug,
        title: p.title,
        description: p.description,
        sdgs: (p.sdgs || []).map(mapSDG),
        purpose: p.purpose,
        tags: (p.tags || []).map(tagMapper),
        categories: (p.categories || []).map(categoryMapper),
        goals: (p.goals || []).map((g: any) => ({
          id: g.id,
          title: g.title,
          description: g.description,
          status: g.status,
        })),
        reviews: (p.reviews || []).map((r: any) => ({
          r: r.id,
          title: r.title,
          description: r.description,
          reviewer: r.reviewer ? mapUserPreview(r.reviewer) : null,
        })),
        locations: (p.locations || []).map((l: any) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          type: l.type,
          lat: l.lat,
          lng: l.lng,
        })),
        announcements: (p.announcements || []).map((a: any) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          status: a.status,
          deadline: a.deadline,
          is_remunerated: a.is_remunerated,
        })),
        links: (p.links || []).map((link: any) => ({
          id: link.id,
          title: link.title,
          category: link.category,
          description: link.description,
          site_name: link.site_name,
          site_url: link.site_url,
        })),
        files: (p.files || []).map((file: any) => ({
          id: file.id,
          title: file.title,
          description: file.description,
          file: file.file,
          mime: file.mime,
        })),
        blog_entries: (p.blog_entries || []).map(mapBlogEntry),
        linked_projects: (p.linked_projects || []).map(mapProjectPreview),
        views: p.views,
        team: {
          members: (p.team?.members || []).map(mapUserPreview),
          owners: (p.team?.owners || []).map(mapUserPreview),
          reviewers: (p.team?.reviewers || []).map(mapUserPreview),
          member_groups: (p.team?.member_groups || []).map(mapPeopleGroupPreview),
          owner_groups: (p.team?.owner_groups || []).map(mapPeopleGroupPreview),
          reviewer_groups: (p.team?.reviewer_groups || []).map(mapPeopleGroupPreview),
        },
      }
    } catch (error) {
      console.error('Error fetching project general data:', error)
    }
    const output = { project_data: results }
    // console.log('MCP TOOL CALLED: project-general-data', { idOrSlug, output })
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
    description: `Get projects that are similar to the one given by its id or slug.   ${FETCH_PROJECT_SLUG_OR_ID}`,
    inputSchema: { idOrSlug: z.string().describe('The id or slug of the project') },
    outputSchema: {
      results: z.array(PROJECT_PREVIEW_OUTPUT_SCHEMA).describe('The list of similar projects'),
    },
  },
  async ({ idOrSlug }, extras) => {
    let results = {}
    try {
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}project/${idOrSlug}/similar/`,
        {},
        extras
      )
      results = queryResult.results.map((p: any) => mapProjectPreview(p))
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
    description: `Get main blog entries about a project given its id or slug. ${FETCH_PROJECT_SLUG_OR_ID}`,
    inputSchema: { idOrSlug: z.string().describe('The id or slug of the project') },
    outputSchema: {
      results: z.array(BLOG_ENTRY_OUTPUT_SCHEMA).describe('The list of blog entries'),
    },
  },
  async ({ idOrSlug }, extras) => {
    let results = {}
    try {
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}project/${idOrSlug}/blog-entry/`,
        {},
        extras
      )
      results = queryResult.results.map(mapBlogEntry)
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
    description: `Get main blog entries about a project given its id or slug. ${FETCH_PROJECT_SLUG_OR_ID}`,
    inputSchema: {
      idOrSlug: z.string().describe('The id or slug of the project'),
      blogEntryId: z.string().describe('The id of the blog entry'),
    },
    outputSchema: { blog_entry: BLOG_ENTRY_OUTPUT_SCHEMA },
  },
  async ({ idOrSlug, blogEntryId }, extras) => {
    let results = {}
    try {
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}project/${idOrSlug}/blog-entry/${blogEntryId}/`,
        {},
        extras
      )
      results = mapBlogEntry(queryResult)
    } catch (error) {
      console.error('Error fetching project blog entry:', error)
    }
    const output = { blog_entry: results }
    // console.log('MCP TOOL CALLED: project-blog-entry', { idOrSlug, output })
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
    description: `Get main general data (job or title, biography, skills, hobbies, and projects) about a person / people / profile / user / member given its id or slug. ${FETCH_USER_SLUG_OR_ID}`,
    inputSchema: {
      idOrSlug: z.string().describe('The id or slug of the user / profile / person / member'),
    },
    outputSchema: {
      user_data: USER_PREVIEW_OUTPUT_SCHEMA.extend({
        is_superuser: z.boolean().describe('Whether the user is a superuser'),
        people_groups: z
          .array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA)
          .optional()
          .nullable()
          .describe('The list of people groups the user belongs to'),
        skills: z
          .array(
            z.object({
              id: z.number().describe('The ID of the skill'),
              tag: z.object({
                id: z.number().optional().nullable().describe('The ID of the tag'),
                title: z.string().optional().nullable().describe('The title of the tag'),
                description: z
                  .string()
                  .optional()
                  .nullable()
                  .describe('The description of the tag'),
              }),
              level: z.number().optional().nullable().describe('The level of the skill'),
              level_to_reach: z
                .number()
                .optional()
                .nullable()
                .describe('The level to reach of the skill'),
              type: z.string().optional().nullable().describe('The type of the skill'),
              can_mentor: z.boolean().describe('Whether the user can mentor this skill'),
              needs_mentor: z
                .boolean()
                .optional()
                .nullable()
                .describe('Whether the user needs a mentor for this skill'),
              comment: z.string().optional().nullable().describe('The comment of the skill'),
            })
          )
          .describe('The list of skills of the user'),
        short_description: z
          .string()
          .optional()
          .nullable()
          .describe('The short description of the user'),
        description: z.string().optional().nullable().describe('The description of the user'),
        location: z.string().optional().nullable().describe('The location of the user'),
        facebook: z.string().optional().nullable().describe('The Facebook profile URL of the user'),
        linkedin: z.string().optional().nullable().describe('The LinkedIn profile URL of the user'),
        website: z.string().optional().nullable().describe('The website URL of the user'),
        sdgs: z.array(SDG_OUTPUT_SCHEMA).describe('The list of SDGs related to the user'),
      }),
    },
  },
  async ({ idOrSlug }, extras) => {
    let results = {}
    try {
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}user/${idOrSlug}/`,
        {},
        extras
      )
      const u = queryResult
      results = {
        id: u.id,
        item_type: 'user',
        link_url: `/profile/${u.slug}/`,
        item_image: u.profile_picture?.variations?.small,
        slug: u.slug,
        is_superuser: u.is_superuser,
        people_groups: (u.people_groups || []).map(mapPeopleGroupPreview),
        skills: (u.skills || []).map((s) => ({
          id: s.id,
          tag: tagMapper(s.tag),
          level: s.level,
          level_to_reach: s.level_to_reach,
          type: s.type,
          can_mentor: s.can_mentor,
          needs_mentor: s.needs_mentor,
          comment: s.comment,
        })),
        given_name: u.given_name,
        family_name: u.family_name,
        short_description: u.short_description,
        description: u.description,
        location: u.location,
        job: u.job,
        email: u.email,
        facebook: u.facebook,
        linkedin: u.linkedin,
        website: u.website,
        sdgs: (u.sdgs || []).map(mapSDG),
      }
    } catch (error) {
      console.error('Error fetching profile general data:', error)
    }
    const output = { user_data: results }
    // console.log('MCP TOOL CALLED: profile-general-data', { idOrSlug, output })
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
    description: `Get main general data about a people group (or member group, or user group) given its id or slug. ${FETCH_GROUP_SLUG_OR_ID}.`,
    inputSchema: { idOrSlug: z.string().describe('The id or slug of the people group') },
    outputSchema: {
      people_group_data: PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA.extend({
        description: z.string().nullable().describe('The description of the people group'),
        short_description: z
          .string()
          .nullable()
          .describe('The short description of the people group'),
      }),
    },
  },
  async ({ idOrSlug }, extras) => {
    let results = {}
    try {
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/people-group/${idOrSlug}/`,
        {},
        extras
      )
      const g = queryResult
      results = {
        id: g.id,
        item_type: 'people_group',
        item_image: g.header_image?.variations?.small,
        slug: g.slug,
        name: g.name,
        description: g.description,
        short_description: g.short_description,
        email: g.email,
        hierarchy: (g.hierarchy || []).map(mapPeopleGroupPreview),
        children: (g.children || []).map(mapPeopleGroupPreview),
      }
    } catch (error) {
      console.error('Error fetching group general data:', error)
    }
    const output = { people_group_data: results }
    // console.log('MCP TOOL CALLED: people-group-data', { idOrSlug, output })
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
    description:
      'Get main general data about the platform organization such as its  description, title and terms and conditions. ',
    inputSchema: {},
    outputSchema: {
      organization_data: z
        .object({
          id: z.number().describe('The ID of the organization'),
          code: z.string().describe('The code of the organization'),
          terms_and_conditions: z.string().describe('The terms and conditions of the organization'),
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

// Add an search tool
server.registerTool(
  'news-list',
  {
    title: 'News list',
    description: 'Get a list of recent news articles.',
    inputSchema: {},
    outputSchema: {
      results: z.array(NEWS_ARTICLE_OUTPUT_SCHEMA).describe('The list of recent news articles'),
    },
  },
  async (_input, extras) => {
    const params = { ordering: '-publication_date', limit: 30, to_date: new Date().toISOString() }
    let results = {}
    try {
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/news/`,
        { params },
        extras
      )
      results = queryResult.results.map(mapNewsArticle)
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
    inputSchema: { slugOrId: z.string().describe('The slug or id of the news article') },
    outputSchema: {
      results: z.array(NEWS_ARTICLE_OUTPUT_SCHEMA).describe('The news article data'),
    },
  },
  async ({ slugOrId }, extras) => {
    let results = {}
    try {
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/news/${slugOrId}/`,
        {},
        extras
      )
      results = mapNewsArticle(queryResult.results)
    } catch (error) {
      console.error('Error fetching organization news item:', error)
    }
    const output = results
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
    outputSchema: {
      results: z
        .array(INSTRUCTION_ARTICLE_OUTPUT_SCHEMA)
        .describe('The list of instruction articles'),
    },
  },
  async (_input, extras) => {
    let results = {}
    try {
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/instruction/`,
        {},
        extras
      )
      results = queryResult.results.map(mapInstructionArticle)
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
    inputSchema: { slugOrId: z.string().describe('The slug or id of the instruction article') },
    outputSchema: {
      instruction_data: INSTRUCTION_ARTICLE_OUTPUT_SCHEMA.describe('The instruction article data'),
    },
  },
  async ({ slugOrId }, extras) => {
    let results = {}
    try {
      const queryResult: any = await mcpFetch(
        // TODO: use org code from config
        `${API_BASE_URL}organization/${orgCode}/instruction/${slugOrId}/`,
        {},
        extras
      )
      results = mapInstructionArticle(queryResult.results)
    } catch (error) {
      console.error('Error fetching organization instruction item:', error)
    }
    const output = results
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

export default server
