import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectPage from '@/pages/ProjectPageV2/ProjectPage.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
