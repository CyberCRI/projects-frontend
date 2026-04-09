import { lpiMount } from '@/../tests/helpers/LpiMount'
import NotificationItem from '@/components/app/NotificationItem.vue'

import { describe, expect, it } from 'vitest'

describe('NotificationItem.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NotificationItem, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
