import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectHeaderTagList from '@/components/project/ProjectHeaderTagList.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectHeaderTagList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectHeaderTagList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
