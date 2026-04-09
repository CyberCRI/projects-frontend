import { lpiMount } from '@/../tests/helpers/LpiMount'
import LinkedProjects from '@/components/project/linked-project/LinkedProjects.vue'

import { describe, expect, it } from 'vitest'

describe('LinkedProjects.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LinkedProjects, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
