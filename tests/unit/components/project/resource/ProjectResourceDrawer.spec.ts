import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectResourceDrawer from '@/components/project/resource/ProjectResourceDrawer.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectResourceDrawer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectResourceDrawer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
