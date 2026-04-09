import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectHeaderSdgList from '@/components/project/ProjectHeaderSdgList.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectHeaderSdgList.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectHeaderSdgList, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
