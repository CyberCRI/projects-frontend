import {
  getLinkedProject,
  getProject,
  getProjectGroups,
  getProjectMembers,
  getProjectSimilars,
} from '~/api/projects.service'
import { mapPeopleGroupPreview, mapUserPreview } from '~/mcp-server/projects/people-tool'
import type { ProjectCategoryModel } from '~/models/project-category.model'
import { getProjectAttachmentLinks } from '~/api/attachment-links.service'
import { getProjectAttachmentFiles } from '~/api/attachment-files.service'
import type { AttachmentLinkModel } from '~/models/attachment-link.model'
import type { AttachmentFileModel } from '~/models/attachment-file.model'
import { getBlogEntries, getBlogEntry } from '~/api/blogentries.service'
import { getProjectAnnouncements } from '~/api/announcements.service'
import type { AnnouncementModel } from '~/models/announcement.model'
import type { BlogEntryModel } from '~/models/blog-entry.model'
import { getProjectLocations } from '~/api/locations.service'
import type { LocationModel } from '~/models/location.model'
import { mcpOptions, orgCode, resultFromTool } from './base'
import type { ProjectModel } from '~/models/project.model'
import { /*SDG_OUTPUT_SCHEMA,*/ mapSDG } from './sdg-tool'
import type { ReviewModel } from '~/models/review.model'
import { getProjectGoals } from '~/api/goals.service'
import type { TypeMcpServer } from '~/interfaces/mcp'
import type { GoalModel } from '~/models/goal.model'
import { getReviews } from '~/api/reviews.service'
import { tagMapper } from './tag-schema'
import N from './zod-schema-utils'
import { pick } from 'es-toolkit'
import { z } from 'zod'

export const CATEGORY_PREVIEW_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the category'),
  slug: N.string().describe('The slug of the category'),
  name: N.string().describe('The name of the category'),
  item_type: N.literal('category').describe('The type of the item, always category'),
  link_url: N.string().describe('The URL link to the category'),
})

export const categoryMapper = (c: ProjectCategoryModel) => ({
  id: c.id,
  slug: c.slug,
  name: c.name,
  link_url: `/categories/${c.slug}/`,
  item_type: 'category',
})

export const PROJECT_PREVIEW_OUTPUT_SCHEMA = N.object({
  id: N.string().describe('The ID of the project'),
  slug: N.string().describe('The slug of the project'),
  item_type: N.literal('project').describe('The type of the item, always project'),
  title: N.string().describe('The title of the project'),
  purpose: N.string().describe('The purpose of the project'),
  categories: N.array(CATEGORY_PREVIEW_OUTPUT_SCHEMA).describe(
    'The list of categories of the project'
  ),
  link_url: N.string().describe('The URL link to the project'),
  item_image: N.string().nullable().describe('The image URL of the project'),
})

export const mapProjectPreview = (project: ProjectModel) => ({
  item_type: 'project',
  link_url: `/projects/${project.slug}/`,
  id: project.id,
  item_image: project.header_image?.variations?.small,
  slug: project.slug,
  title: project.title,
  description: project.description,
  sdgs: (project.sdgs || []).map(mapSDG),
  purpose: project.purpose,
  tags: (project.tags || []).map(tagMapper),
  categories: (project.categories || []).map(categoryMapper),
  views: project.views,
})

const mapGoalPreview = (goal: GoalModel) => pick(goal, ['id', 'title', 'description', 'status'])
const mapReviewPreview = (review: ReviewModel) => ({
  ...pick(review, ['id', 'title', 'description']),
  reviewer: review.reviewer ? mapUserPreview(review.reviewer) : null,
})
const mapLocationPreview = (location: LocationModel) =>
  pick(location, ['id', 'title', 'description', 'type', 'lat', 'lng'])
const mapAnnouncementPreview = (announcement: AnnouncementModel) =>
  pick(announcement, ['id', 'title', 'description', 'status', 'deadline', 'is_remunerated'])

const mapLinkPreview = (link: AttachmentLinkModel) =>
  pick(link, ['id', 'title', 'description', 'site_name', 'site_url'])
const mapFilePreview = (file: AttachmentFileModel) =>
  pick(file, ['id', 'title', 'description', 'file', 'mime'])

/*
const BLOG_ENTRY_OUTPUT_SCHEMA = N.object({
  id: N.number().describe('The ID of the blog entry'),
  title: N.string().describe('The title of the blog entry'),
  content: N.string().describe('The content of the blog entry'),
})
*/

export const FETCH_PROJECT_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the project, use the search tool with the project name, the project id or slug will be in the first result, else use the previously mentioned slug or id.'

export const mapBlogEntry = (b: BlogEntryModel) => ({
  id: b.id,
  title: b.title,
  content: b.content,
})

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'project-general-data',
    {
      title: 'Project general data',
      description: `Get main general data (description, goals, blog entries, members...) about a project given its id or slug. ${FETCH_PROJECT_SLUG_OR_ID}`,
      inputSchema: { idOrSlug: z.string().describe('The id or slug of the project') },
      /*outputSchema: {
        project_data: PROJECT_PREVIEW_OUTPUT_SCHEMA.extend({
          purpose: N.string().describe('The purpose of the project'),
          description: N.string().nullable().describe('The description of the project'),
          sdgs: N.array(SDG_OUTPUT_SCHEMA).describe('The list of SDGs related to the project'),
          tags: N.array(
            N.object({ id: N.number(), title: N.string(), description: N.string() })
          ).describe('The list of tags of the project'),
          goals: N.array(
            N.object({
              id: N.number(),
              title: N.string().describe('The title of the goal'),
              description: N.string().describe('The description of the goal'),
              status: N.string().describe('The status of the goal'),
            })
          ).describe('The list of goals of the project'),
          reviews: N.array(
            N.object({
              title: N.string().describe('The title of the review'),
              description: N.string().describe('The description of the review'),
              reviewer: USER_PREVIEW_OUTPUT_SCHEMA.nullable().describe(
                'The reviewer of the review'
              ),
            })
          ).describe('The list of reviews of the project'),
          locations: N.array(
            N.object({
              id: N.number(),
              title: N.string().describe('The title of the location'),
              description: N.string().describe('The description of the location'),
              type: N.string().describe('The type of the location'),
              lat: N.number().describe('The latitude of the location'),
              lng: N.number().describe('The longitude of the location'),
            })
          ).describe('The list of locations of the project'),
          announcements: N.array(
            N.object({
              id: N.number(),
              title: N.string().describe('The title of the announcement'),
              description: N.string().describe('The description of the announcement'),
              status: N.string().describe('The status of the announcement'),
              deadline: z.string().nullable().describe('The deadline of the announcement'),
              is_remunerated: z.boolean().describe('Whether the announcement is remunerated'),
            })
          ).describe('The list of announcements of the project'),
          links: N.array(
            N.object({
              id: N.number(),
              title: N.string().describe('The title of the link'),
              category: N.string(),
              description: N.string().describe('The description of the link'),
              site_name: N.string(),
              site_url: N.string(),
            })
          ).describe('The list of links of the project'),
          files: N.array(
            N.object({
              id: N.number(),
              title: N.string().describe('The title of the file'),
              description: N.string().describe('The description of the file'),
              file: N.string(),
              mime: N.string(),
            })
          ).describe('The list of files of the project'),
          blog_entries: N.array(BLOG_ENTRY_OUTPUT_SCHEMA).describe(
            'The list of blog entries of the project'
          ),
          linked_projects: N.array(PROJECT_PREVIEW_OUTPUT_SCHEMA).describe(
            'The list of linked projects of the project'
          ),
          views: N.number().describe('The number of views of the project'),
          team: N.object({
            members: N.array(USER_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team members of the project'
            ),
            owners: N.array(USER_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team owners of the project'
            ),
            reviewers: N.array(USER_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team reviewers of the project'
            ),
            member_groups: N.array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team member groups of the project'
            ),
            owner_groups: N.array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team owner groups of the project'
            ),
            reviewer_groups: N.array(PEOPLE_GROUP_PREVIEW_OUTPUT_SCHEMA).describe(
              'The list of team reviewer groups of the project'
            ),
          }),
        }),
      },*/
    },
    resultFromTool(async ({ idOrSlug }, extras) => {
      const opts = mcpOptions(extras)

      const onError = (error) => {
        console.error(error)
        // return empty objects
        return {}
      }

      /*
       fetch all datas from projects
       and contruct object with each key equal results
      */

      const datas = await Promise.all([
        getProjectGoals(idOrSlug, opts)
          .then((data) => ({ goals: data.results.map(mapGoalPreview) }))
          .catch(onError),
        getReviews(idOrSlug, opts)
          .then((data) => ({ reviews: data.results.map(mapReviewPreview) }))
          .catch(onError),
        getProjectLocations(idOrSlug, opts)
          .then((data) => ({ locations: data.map(mapLocationPreview) }))
          .catch(onError),
        getProjectAnnouncements(idOrSlug, opts)
          .then((data) => ({ announcements: data.results.map(mapAnnouncementPreview) }))
          .catch(onError),
        getProjectAttachmentLinks(idOrSlug, opts)
          .then((data) => ({ links: data.results.map(mapLinkPreview) }))
          .catch(onError),
        getProjectAttachmentFiles(idOrSlug, opts)
          .then((data) => ({ files: data.results.map(mapFilePreview) }))
          .catch(onError),
        getBlogEntries(idOrSlug, opts)
          .then((data) => ({ blogs: data.results.map(mapBlogEntry) }))
          .catch(onError),
        getLinkedProject(idOrSlug, opts)
          .then((data) => ({ linked_project: data.results.map(mapProjectPreview) }))
          .catch(onError),
        getProjectMembers(idOrSlug, opts)
          .then((data) => ({ members: data.results.map(mapUserPreview) }))
          .catch(onError),
        getProjectGroups(idOrSlug, opts)
          .then((data) => ({ groups: data.results.map(mapPeopleGroupPreview) }))
          .catch(onError),
      ]).then((arr) => {
        return arr.reduce(
          (previous, now) => ({
            ...previous,
            ...now,
          }),
          {}
        )
      })

      return getProject(idOrSlug, {
        ...opts,
        query: {
          modules: 'none',
        },
      }).then((project) => ({
        ...mapProjectPreview(project),
        // add all modules
        ...datas,
      }))
    })
  )

  // Add an search tool
  server.registerTool(
    'project-similar',
    {
      title: 'Project similar projects',
      description: `Get projects that are similar to the one given by its id or slug.   ${FETCH_PROJECT_SLUG_OR_ID}`,
      inputSchema: { idOrSlug: z.string().describe('The id or slug of the project') },
      /*outputSchema: {
        results: z.array(PROJECT_PREVIEW_OUTPUT_SCHEMA).describe('The list of similar projects'),
        },*/
    },
    resultFromTool(({ idOrSlug }, extras) => {
      const opts = mcpOptions(extras)
      return getProjectSimilars(idOrSlug, {
        ...opts,
        query: {
          organizations: [orgCode],
        },
      }).then((page) => page.results.map(mapProjectPreview))
    })
  )

  // Add an search tool
  server.registerTool(
    'project-blog-entries',
    {
      title: 'Project blog entries',
      description: `Get main blog entries about a project given its id or slug. ${FETCH_PROJECT_SLUG_OR_ID}`,
      inputSchema: { idOrSlug: z.string().describe('The id or slug of the project') },
      /*  outputSchema: {
        results: N.array(BLOG_ENTRY_OUTPUT_SCHEMA).describe('The list of blog entries'),
        },*/
    },
    resultFromTool(({ idOrSlug }, extras) => {
      const opts = mcpOptions(extras)
      return getBlogEntries(idOrSlug, opts).then((page) => page.results.map(mapBlogEntry))
    })
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
      /* outputSchema: { blog_entry: BLOG_ENTRY_OUTPUT_SCHEMA },*/
    },
    resultFromTool(({ idOrSlug, blogEntryId }, extras) => {
      const opts = mcpOptions(extras)
      return getBlogEntry(idOrSlug, blogEntryId, opts).then((blog) => mapBlogEntry(blog))
    })
  )
}
