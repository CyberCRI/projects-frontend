import { lpiMount } from '@/../tests/helpers/LpiMount'
import TipTapEditorContent from '@/components/base/form/TextEditor/TipTapEditorContent.vue'

import { describe, expect, it } from 'vitest'

describe('TipTapEditorContent.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TipTapEditorContent, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
