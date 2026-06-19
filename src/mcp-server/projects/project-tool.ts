import {
  getLinkedProject,
  getProject,
  getProjectGroups,
  getProjectMembers,
  getProjectSimilars,
} from '~/api/projects.service'
import { mapPeopleGroupPreview, mapUserPreview } from '~/mcp-server/projects/people-tool'
import type { ProjectModel, ProjectModulesKeys } from '~/models/project.model'
import type { ProjectCategoryModel } from '~/models/project-category.model'
import { getProjectAttachmentLinks } from '~/api/attachment-links.service'
import { getProjectAttachmentFiles } from '~/api/attachment-files.service'
import type { AttachmentLinkModel } from '~/models/attachment-link.model'
import type { AttachmentFileModel } from '~/models/attachment-file.model'
import { addIfExists, tagMapPreview } from '~/mcp-server/projects/utils'
import { getBlogEntries, getBlogEntry } from '~/api/blogentries.service'
import { getProjectAnnouncements } from '~/api/announcements.service'
import type { AnnouncementModel } from '~/models/announcement.model'
import type { BlogEntryModel } from '~/models/blog-entry.model'
import { getProjectLocations } from '~/api/locations.service'
import type { LocationModel } from '~/models/location.model'
import { mcpOptions, orgCode, resultFromTool } from './base'
import type { ReviewModel } from '~/models/review.model'
import { getProjectGoals } from '~/api/goals.service'
import type { TypeMcpServer } from '~/interfaces/mcp'
import type { GoalModel } from '~/models/goal.model'
import { getReviews } from '~/api/reviews.service'
import { mapSDG } from './sdg-tool'
import { pick } from 'es-toolkit'
import { z } from 'zod'

export const categoryMapper = (c: ProjectCategoryModel) => ({
  link_url: `/categories/${c.slug}/`,
  item_type: 'category',
  ...pick(c, ['id', 'slug', 'name']),
})

export const mapProjectPreview = (project: ProjectModel) => ({
  item_type: 'project',
  link_url: `/projects/${project.slug}/`,
  ...pick(project, ['id', 'slug', 'title', 'description', 'purpose', 'views']),
  item_image: project.header_image?.variations?.small,

  ...addIfExists('sdgs', project, (data: ProjectModel['sdgs']) => data.map(mapSDG)),
  ...addIfExists('tags', project, (data: ProjectModel['tags']) => data.map(tagMapPreview)),
  ...addIfExists('categories', project, (data: ProjectModel['categories']) =>
    data.map(categoryMapper)
  ),
})

const mapGoalPreview = (goal: GoalModel) => ({
  item_type: 'project_goal',
  ...pick(goal, ['id', 'title', 'description', 'status']),
})
const mapReviewPreview = (review: ReviewModel) => ({
  item_type: 'project_review',
  ...pick(review, ['id', 'title', 'description']),
  reviewer: review.reviewer ? mapUserPreview(review.reviewer) : null,
})
const mapLocationPreview = (location: LocationModel) => ({
  item_type: 'project_location',
  ...pick(location, ['id', 'title', 'description', 'type', 'lat', 'lng']),
})
const mapAnnouncementPreview = (announcement: AnnouncementModel) => ({
  item_type: 'project_announcement',
  ...pick(announcement, ['id', 'title', 'description', 'status', 'deadline', 'is_remunerated']),
})

const mapLinkPreview = (link: AttachmentLinkModel) => ({
  item_type: 'project_link',
  ...pick(link, ['id', 'title', 'description', 'site_name', 'site_url']),
})
const mapFilePreview = (file: AttachmentFileModel) => ({
  item_type: 'project_file',
  ...pick(file, ['id', 'title', 'description', 'file', 'mime']),
})

export const mapBlogEntry = (blog: BlogEntryModel) => ({
  item_type: 'project_blog',
  ...pick(blog, ['id', 'title', 'content']),
})

export const FETCH_PROJECT_SLUG_OR_ID =
  'If you dont have the slug (given under "slug" or "id" key in a previous tool call data) or id of the project, use the search tool with the project name, the project id or slug will be in the first result, else use the previously mentioned slug or id.'

export default (server: TypeMcpServer) => {
  // Add an search tool
  server.registerTool(
    'project-general-data',
    {
      title: 'Project general data',
      description: `Get main general data (description, goals, blog entries, members...) about a project given its id or slug. ${FETCH_PROJECT_SLUG_OR_ID}`,
      inputSchema: { idOrSlug: z.string().describe('The id or slug of the project') },
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
      const optionModule = {
        ...opts,
        query: {
          limit: 10,
        },
      }
      const modulesData: {
        [key in ProjectModulesKeys]?: any
      } = {}

      await Promise.all([
        getProjectGoals(idOrSlug, optionModule)
          .then((data) => (modulesData.goals = data.results.map(mapGoalPreview)))
          .catch(onError),
        getReviews(idOrSlug, optionModule)
          .then((data) => (modulesData.reviews = data.results.map(mapReviewPreview)))
          .catch(onError),
        getProjectLocations(idOrSlug, opts)
          .then((data) => (modulesData.locations = data.map(mapLocationPreview)))
          .catch(onError),
        getProjectAnnouncements(idOrSlug, optionModule)
          .then((data) => (modulesData.announcements = data.results.map(mapAnnouncementPreview)))
          .catch(onError),
        getProjectAttachmentLinks(idOrSlug, optionModule)
          .then((data) => (modulesData.links = data.results.map(mapLinkPreview)))
          .catch(onError),
        getProjectAttachmentFiles(idOrSlug, optionModule)
          .then((data) => (modulesData.files = data.results.map(mapFilePreview)))
          .catch(onError),
        getBlogEntries(idOrSlug, optionModule)
          .then((data) => (modulesData.blogs = data.results.map(mapBlogEntry)))
          .catch(onError),
        getLinkedProject(idOrSlug, optionModule)
          .then((data) => (modulesData.linked_projects = data.results.map(mapProjectPreview)))
          .catch(onError),
        getProjectMembers(idOrSlug, optionModule)
          .then((data) => (modulesData.members = data.results.map(mapUserPreview)))
          .catch(onError),
        getProjectGroups(idOrSlug, optionModule)
          .then((data) => (modulesData.groups = data.results.map(mapPeopleGroupPreview)))
          .catch(onError),
      ])

      return getProject(idOrSlug, {
        ...opts,
        query: {
          modules: 'none',
        },
      }).then((project) => ({
        ...mapProjectPreview(project),
        // add all modules
        ...modulesData,
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
        blogEntryId: z.number().describe('The id of the blog entry'),
      },
    },
    resultFromTool(({ idOrSlug, blogEntryId }, extras) => {
      const opts = mcpOptions(extras)
      return getBlogEntry(idOrSlug, blogEntryId, opts).then((blog) => mapBlogEntry(blog))
    })
  )
}
