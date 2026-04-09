import { lpiMount } from '@/../tests/helpers/LpiMount'
import AccountInfos from '@/components/people/Account/AccountInfos.vue'

import { describe, expect, it } from 'vitest'

describe('AccountInfos.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AccountInfos, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
