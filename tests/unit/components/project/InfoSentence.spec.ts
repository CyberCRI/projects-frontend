import { lpiMount } from '@/../tests/helpers/LpiMount'
import InfoSentence from '@/components/project/InfoSentence.vue'

import { describe, expect, it } from 'vitest'

describe('InfoSentence.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(InfoSentence, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
