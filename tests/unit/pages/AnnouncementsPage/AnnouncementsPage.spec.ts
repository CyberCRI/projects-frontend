import { lpiMount } from '@/../tests/helpers/LpiMount'
import AnnouncementsPage from '@/pages/AnnouncementsPage/AnnouncementsPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('AnnouncementsPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(AnnouncementsPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
