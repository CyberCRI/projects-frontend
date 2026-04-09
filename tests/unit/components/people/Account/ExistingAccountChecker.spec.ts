import { lpiMount } from '@/../tests/helpers/LpiMount'
import ExistingAccountChecker from '@/components/people/Account/ExistingAccountChecker.vue'

import { describe, expect, it } from 'vitest'

describe('ExistingAccountChecker.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ExistingAccountChecker, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
