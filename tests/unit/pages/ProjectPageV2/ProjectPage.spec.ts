import ProjectPage from '~/pages/ProjectPageV2/ProjectPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { AttachmentLinkFactory } from '~~/tests/factories/attachment-link.factory'
import { AttachmentFileFactory } from '~~/tests/factories/attachment-file.factory'
import ProjectSummaryTab from '~/pages/ProjectPageV2/Tabs/ProjectSummaryTab.vue'
import { AnnouncementFactory } from '~~/tests/factories/announcement.factory'
import { mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { ProjectOutputFactory } from '~~/tests/factories/project.factory'
import BlogEntryFactory from '~~/tests/factories/blog-entry.factory'
import { CommentFactory } from '~~/tests/factories/comment.factory'
import { ReviewFactory } from '~~/tests/factories/review.factory'
import { UserFactory } from '~~/tests/factories/user.factory'
import { GoalFactory } from '~~/tests/factories/goal.factory'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

const project = ProjectOutputFactory.generate()

mockNuxtImport('useRoute', () => () => ({
  params: { slugOrId: project.id },
  path: `/projects/${project.id}/summary`,
  fullPath: `/projects/${project.id}/summary`,
  query: {},
}))

describe('ProjectPage.vue', () => {
  it('should render component', async () => {
    const user = UserFactory.generate()

    registerEndpoint(`user/${user.id}/`, () => user)
    registerEndpoint(`project/${project.id}/file/`, () =>
      PaginationsFactory.generate({ results: AttachmentFileFactory.generateMany(10) })
    )
    registerEndpoint(`project/${project.id}/link/`, () =>
      PaginationsFactory.generate({ results: AttachmentLinkFactory.generateMany(10) })
    )
    registerEndpoint(`project/${project.id}/review/`, () =>
      PaginationsFactory.generate({ results: ReviewFactory.generateMany(10) })
    )
    registerEndpoint(`project/${project.id}/goal/`, () =>
      PaginationsFactory.generate({ results: GoalFactory.generateMany(10) })
    )
    registerEndpoint(`project/${project.id}/blog-entry/`, () =>
      PaginationsFactory.generate({ results: BlogEntryFactory.generateMany(10) })
    )
    registerEndpoint(`project/${project.id}/announcement/`, () =>
      PaginationsFactory.generate({ results: AnnouncementFactory.generateMany(10) })
    )
    registerEndpoint(`project/${project.id}/project-message/`, () =>
      PaginationsFactory.generate({ results: [] })
    )
    registerEndpoint(`project/${project.id}/comment/`, () =>
      PaginationsFactory.generate({ results: CommentFactory.generateMany(10) })
    )
    registerEndpoint(`project/${project.id}/similar/`, () => [])
    registerEndpoint(`project/${project.id}/location/`, () => [])

    // alway at end to no match other endpoints
    registerEndpoint(`project/${project.id}/`, () => project)

    const wrapper = await lpiMountSuspended(ProjectPage, {
      stubs: { NuxtPage: ProjectSummaryTab, NuxtLink: true },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
