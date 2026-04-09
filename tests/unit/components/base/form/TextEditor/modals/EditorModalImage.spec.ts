import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditorModalImage from '@/components/base/form/TextEditor/modals/EditorModalImage.vue'

import { describe, expect, it } from 'vitest'

describe('EditorModalImage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditorModalImage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
