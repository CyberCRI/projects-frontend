import { lpiMount } from '@/../tests/helpers/LpiMount'
import AccountFormTitleBlock from '@/components/people/Account/AccountFormTitleBlock.vue'

import { describe, expect, it } from 'vitest'

describe('AccountFormTitleBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(AccountFormTitleBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
