import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import {
  AnnouncementFactory,
  TranslatedAnnouncementFactory,
} from '~~/tests/factories/announcement.factory'
import ProjectAnnouncementsTab from '~/pages/ProjectPageV2/Tabs/Announcements/ProjectAnnouncementsTab.vue'
import { ProjectFactory, TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

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
