import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectHeaderTitle from '@/components/project/ProjectHeaderTitle.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectHeaderTitle.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectHeaderTitle, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
