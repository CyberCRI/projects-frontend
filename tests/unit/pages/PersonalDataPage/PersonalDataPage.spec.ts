import PersonalDataPage from '~/pages/PersonalDataPage/PersonalDataPage.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'

import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('PersonalDataPage.vue', () => {
  it('should render component', async () => {
    const wrapper = await lpiMountSuspended(PersonalDataPage)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })
})
