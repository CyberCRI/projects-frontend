import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectLogo from '@/components/base/media/ProjectLogo.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectLogo.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectLogo, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
