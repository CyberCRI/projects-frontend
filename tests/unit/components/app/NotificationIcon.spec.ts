import { lpiMount } from '@/../tests/helpers/LpiMount'
import NotificationIcon from '@/components/app/NotificationIcon.vue'

import { describe, expect, it } from 'vitest'

describe('NotificationIcon.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NotificationIcon, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
