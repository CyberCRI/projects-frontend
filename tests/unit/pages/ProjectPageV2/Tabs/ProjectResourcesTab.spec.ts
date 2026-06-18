import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectResourcesTab from '@/pages/ProjectPageV2/Tabs/Resources/ProjectResourcesTab.vue'
import { ProjectFactory, TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { AttachmentLinkFactory } from '~~/tests/factories/attachment-link.factory'
import { AttachmentFileFactory } from '~~/tests/factories/attachment-file.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectResourcesTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()

    registerEndpoint(`project/${project.slug}/links/`, () => {
      return PaginationsFactory.generate({
        results: AttachmentLinkFactory.generateMany(10),
      })
    })
    registerEndpoint(`project/${project.slug}/files/`, () => {
      return PaginationsFactory.generate({
        results: AttachmentFileFactory.generateMany(10),
      })
    })

    const wrapper = await lpiMountSuspended(ProjectResourcesTab, {
      props: {
        project,
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
