import { lpiMount } from '@/../tests/helpers/LpiMount'
import CreateEventPage from '@/pages/CreateEventPage/CreateEventPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('CreateEventPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(CreateEventPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
