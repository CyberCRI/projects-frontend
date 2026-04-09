import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectHeaderPurpose from '@/components/project/ProjectHeaderPurpose.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectHeaderPurpose.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectHeaderPurpose, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
