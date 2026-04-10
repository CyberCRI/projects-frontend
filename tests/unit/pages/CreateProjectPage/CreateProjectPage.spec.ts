import { lpiMount } from '@/../tests/helpers/LpiMount'
import CreateProjectPage from '@/pages/CreateProjectPage/CreateProjectPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('CreateProjectPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(CreateProjectPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
