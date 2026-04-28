import AnnouncementsPage from '~/pages/AnnouncementsPage/AnnouncementsPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { AnnouncementFactory } from '~~/tests/factories/announcement.factory'
import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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
