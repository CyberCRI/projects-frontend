import { lpiMount } from '@/../tests/helpers/LpiMount'
import UserPresenceCard from '@/components/base/form/TextEditor/UserPresenceCard.vue'

import { describe, expect, it } from 'vitest'

describe('UserPresenceCard.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(UserPresenceCard, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
