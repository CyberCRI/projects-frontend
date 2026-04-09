import { lpiMount } from '@/../tests/helpers/LpiMount'
import CreateEventPage from '@/pages/CreateEventPage/CreateEventPage.vue'

import { describe, expect, it } from 'vitest'

describe('CreateEventPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(CreateEventPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
