import { lpiMount } from '@/../tests/helpers/LpiMount'
import EventForm from '@/components/event/EventForm/EventForm.vue'

import { describe, expect, it } from 'vitest'

describe('EventForm.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(EventForm, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
