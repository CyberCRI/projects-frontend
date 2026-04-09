import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsfeedAnnouncementsItem from '@/components/home/HomeNewsfeed/NewsfeedAnnouncementsItem.vue'

import { describe, expect, it } from 'vitest'

describe('NewsfeedAnnouncementsItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NewsfeedAnnouncementsItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
