import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import ProjectAnnouncementsTab from '~/pages/ProjectPageV2/Tabs/Announcements/ProjectAnnouncementsTab.vue'
import { AnnouncementFactory } from '~~/tests/factories/announcement.factory'
import { TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('ProjectAnnouncementsTab.vue', () => {
  it('should render component', async () => {
    const project = TranslatedProjectFactory.generate()

    registerEndpoint(`project/${project.id}/announcement/`, () => {
      return PaginationsFactory.generate({
        results: AnnouncementFactory.generateMany(10),
      })
    })

    const props = { project }

    const wrapper = await lpiMountSuspended(ProjectAnnouncementsTab, {
      props,
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
