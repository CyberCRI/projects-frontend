import { lpiMount } from '@/../tests/helpers/LpiMount'
import TeamSection from '@/components/project/TeamSection.vue'

import { describe, expect, it } from 'vitest'

describe('TeamSection.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TeamSection, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
