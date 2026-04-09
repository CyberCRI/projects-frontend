import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiCodeBlockNodeView from '@/components/base/form/TextEditor/tiptap-extensions/LpiCodeBlockNodeView.vue'

import { describe, expect, it } from 'vitest'

describe('LpiCodeBlockNodeView.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(LpiCodeBlockNodeView, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
