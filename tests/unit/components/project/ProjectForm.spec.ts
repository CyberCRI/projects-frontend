import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectForm from '@/components/project/ProjectForm.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectForm.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectForm, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
