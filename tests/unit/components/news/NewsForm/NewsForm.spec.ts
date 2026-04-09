import { lpiMount } from '@/../tests/helpers/LpiMount'
import NewsForm from '@/components/news/NewsForm/NewsForm.vue'

import { describe, expect, it } from 'vitest'

describe('NewsForm.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(NewsForm, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
