import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectPreview from '@/components/project/ProjectPreview.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectPreview.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectPreview, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
