import { lpiMount } from '@/../tests/helpers/LpiMount'
import SubPageTitle from '@/components/base/SubPageTitle.vue'

import { describe, expect, it } from 'vitest'

describe('SubPageTitle.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SubPageTitle, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
