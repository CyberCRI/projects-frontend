import { lpiMount } from '@/../tests/helpers/LpiMount'
import TipTapEditorContainer from '@/components/base/form/TextEditor/TipTapEditorContainer.vue'

import { describe, expect, it } from 'vitest'

describe('TipTapEditorContainer.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TipTapEditorContainer, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
