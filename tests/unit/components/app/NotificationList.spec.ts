import { lpiMount } from '@/../tests/helpers/LpiMount'
import NotificationList from '@/components/app/NotificationList.vue'

import { describe, expect, it } from 'vitest'

describe('NotificationList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NotificationList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
