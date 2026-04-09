import { lpiMount } from '@/../tests/helpers/LpiMount'
import AccountSection from '@/components/people/Account/AccountSection.vue'

import { describe, expect, it } from 'vitest'

describe('AccountSection.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AccountSection, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
