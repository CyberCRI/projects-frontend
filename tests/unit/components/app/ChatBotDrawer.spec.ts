import { lpiMount } from '@/../tests/helpers/LpiMount'
import ChatBotDrawer from '@/components/app/ChatBotDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ChatBotDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ChatBotDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
