import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import AnnouncementsPage from '~/pages/AnnouncementsPage/AnnouncementsPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { PaginationsFactory } from '../../../factories/paginations.factory'
import { AnnouncementFactory } from '../../../factories/announcement.factory'

describe('AnnouncementsPage.vue', () => {
  it('should render component', async () => {
    registerEndpoint('announcement/', () =>
      PaginationsFactory.generate({
        results: AnnouncementFactory.generateMany(10),
      })
    )

    const wrapper = await lpiMountSuspended(AnnouncementsPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
