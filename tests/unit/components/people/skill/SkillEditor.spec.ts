import { lpiMount } from '@/../tests/helpers/LpiMount'
import SkillEditor from '@/components/people/skill/SkillEditor.vue'

import { describe, expect, it } from 'vitest'

describe('SkillEditor.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(SkillEditor, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
