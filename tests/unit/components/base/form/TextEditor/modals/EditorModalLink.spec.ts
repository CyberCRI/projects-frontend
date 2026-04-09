import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditorModalLink from '@/components/base/form/TextEditor/modals/EditorModalLink.vue'

import { describe, expect, it } from 'vitest'

describe('EditorModalLink.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditorModalLink, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
