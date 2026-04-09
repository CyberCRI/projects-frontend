import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectListSkeleton from '@/components/project/ProjectListSkeleton.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectListSkeleton.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectListSkeleton, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
