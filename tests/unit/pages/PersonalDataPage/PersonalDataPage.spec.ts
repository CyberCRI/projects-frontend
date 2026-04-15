import { lpiMountSuspended } from '@/../tests/helpers/LpiMount'
import PersonalDataPage from '@/pages/PersonalDataPage/PersonalDataPage.vue'

import { describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('PersonalDataPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(PersonalDataPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
