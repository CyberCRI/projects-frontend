import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProjectTeamEditor from '@/components/project/ProjectTeamEditor.vue'

import { describe, expect, it } from 'vitest'

describe('ProjectTeamEditor.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ProjectTeamEditor, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
