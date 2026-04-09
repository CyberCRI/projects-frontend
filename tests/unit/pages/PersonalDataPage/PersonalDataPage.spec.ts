import { lpiMount } from '@/../tests/helpers/LpiMount'
import PersonalDataPage from '@/pages/PersonalDataPage/PersonalDataPage.vue'

import { describe, expect, it } from 'vitest'

describe('PersonalDataPage.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(PersonalDataPage, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
