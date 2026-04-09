import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditorModalColor from '@/components/base/form/TextEditor/modals/EditorModalColor.vue'

import { describe, expect, it } from 'vitest'

describe('EditorModalColor.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditorModalColor, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
