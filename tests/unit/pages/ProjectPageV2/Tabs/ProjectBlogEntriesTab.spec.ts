import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectBlogEntriesTab from '~/pages/ProjectPageV2/Tabs/BlogEntries/ProjectBlogEntriesTab.vue'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import BlogEntryFactory from '~~/tests/factories/blog-entry.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProjectBlogEntriesTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()

    registerEndpoint(`project/${project.id}/blog-entry/`, () => {
      return PaginationsFactory.generate({
        results: BlogEntryFactory.generateMany(10),
      })
    })

    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectBlogEntriesTab, {
      props,
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
