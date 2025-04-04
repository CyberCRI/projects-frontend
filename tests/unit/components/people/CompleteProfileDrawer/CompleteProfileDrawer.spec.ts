import { lpiMount, lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import CompleteProfileDrawer from '@/components/people/CompleteProfileDrawer/CompleteProfileDrawer.vue'

import { beforeEach, describe, expect, it } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('CompleteProfileDrawer.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        isOpened: true,
        initialStep: 2,
      },
      i18n,
    }
  })

  it('should render component', () => {
    const wrapper = lpiShallowMount(CompleteProfileDrawer, defaultParams)
    expect(wrapper.exists()).toBe(true)
  }),
    it('should emit the close event', () => {
      wrapper = lpiShallowMount(CompleteProfileDrawer, defaultParams)
      const vm: any = wrapper.vm

      vm.cancel()
      expect(wrapper.emitted('close')).toBeTruthy()
    })
})
