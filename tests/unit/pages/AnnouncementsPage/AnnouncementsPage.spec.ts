import { lpiMount } from '@/../tests/helpers/LpiMount'
import AnnouncementsPage from '@/pages/AnnouncementsPage/AnnouncementsPage.vue'

import { describe, expect, it } from 'vitest'

describe('AnnouncementsPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AnnouncementsPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
