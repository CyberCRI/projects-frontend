import { lpiMount } from '@/../tests/helpers/LpiMount'
import TeamCardInline from '@/components/people/TeamCard/TeamCardInline.vue'

import { describe, expect, it } from 'vitest'

describe('TeamCardInline.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TeamCardInline, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
