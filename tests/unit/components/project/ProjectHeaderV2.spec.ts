import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectHeaderV2 from '@/components/project/ProjectHeaderV2.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectHeaderV2.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectHeaderV2, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
