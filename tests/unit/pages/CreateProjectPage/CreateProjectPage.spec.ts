import { lpiMount } from '@/../tests/helpers/LpiMount'
import CreateProjectPage from '@/pages/CreateProjectPage/CreateProjectPage.vue'

import { describe, expect, it } from 'vitest'

describe('CreateProjectPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CreateProjectPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
