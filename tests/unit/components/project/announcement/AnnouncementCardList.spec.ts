import { lpiMount } from '@/../tests/helpers/LpiMount'
import AnnouncementCardList from '@/components/project/announcement/AnnouncementCardList.vue'

import { describe, expect, it } from 'vitest'

describe('AnnouncementCardList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AnnouncementCardList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
