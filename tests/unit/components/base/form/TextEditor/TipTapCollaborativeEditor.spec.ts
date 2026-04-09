import { lpiMount } from '@/../tests/helpers/LpiMount'
import TipTapCollaborativeEditor from '@/components/base/form/TextEditor/TipTapCollaborativeEditor.vue'

import { describe, expect, it } from 'vitest'

describe('TipTapCollaborativeEditor.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TipTapCollaborativeEditor, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
