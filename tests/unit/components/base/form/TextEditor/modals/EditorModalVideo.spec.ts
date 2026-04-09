import { lpiMount } from '@/../tests/helpers/LpiMount'
import EditorModalVideo from '@/components/base/form/TextEditor/modals/EditorModalVideo.vue'

import { describe, expect, it } from 'vitest'

describe('EditorModalVideo.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EditorModalVideo, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
