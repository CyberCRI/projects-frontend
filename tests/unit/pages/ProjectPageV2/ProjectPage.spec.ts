import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectPage from '@/pages/ProjectPageV2/ProjectPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ProjectPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(ProjectPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
