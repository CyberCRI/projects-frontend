import { lpiMount } from '@/../tests/helpers/LpiMount'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'

import { describe, expect, it } from 'vitest'

describe('TipTapEditor.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TipTapEditor, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
