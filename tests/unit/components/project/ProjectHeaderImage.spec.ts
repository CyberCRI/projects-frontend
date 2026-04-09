import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectHeaderImage from '@/components/project/ProjectHeaderImage.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectHeaderImage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectHeaderImage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
