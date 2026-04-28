import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import FooterEnglishTips from '~/components/app/FooterEnglishTips.vue'

import { describe, expect, it } from 'vitest'

describe('FooterEnglishTips', () => {
  it('should render FooterEnglishTips component', () => {
    const wrapper = lpiShallowMount(FooterEnglishTips)

    expect(wrapper.exists()).toBeTruthy()
  })
})
