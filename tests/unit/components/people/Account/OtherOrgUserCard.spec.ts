import { lpiMount } from '@/../tests/helpers/LpiMount'
import OtherOrgUserCard from '@/components/people/Account/OtherOrgUserCard.vue'

import { describe, expect, it } from 'vitest'

describe('OtherOrgUserCard.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(OtherOrgUserCard, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
