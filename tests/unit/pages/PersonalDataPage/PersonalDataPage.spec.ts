import { lpiMount } from '@/../tests/helpers/LpiMount'
import PersonalDataPage from '@/pages/PersonalDataPage/PersonalDataPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('PersonalDataPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = await lpiMount(PersonalDataPage, { props })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
