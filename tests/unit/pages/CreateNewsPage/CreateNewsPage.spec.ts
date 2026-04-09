import { lpiMount } from '@/../tests/helpers/LpiMount'
import CreateNewsPage from '@/pages/CreateNewsPage/CreateNewsPage.vue'

import { describe, expect, it } from 'vitest'

describe('CreateNewsPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CreateNewsPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
