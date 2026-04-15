import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import TermsOfServicePage from '@/pages/TermsOfServicePage/TermsOfServicePage.vue'

import { describe, expect, it } from 'vitest'
describe('TermsOfServicePage.vue', () => {
  it('should render component', () => {
    const wrapper = lpiShallowMount(TermsOfServicePage, {})
    expect(wrapper.exists()).toBe(true)
  })
})
