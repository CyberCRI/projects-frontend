import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import CroppedImage from '@/components/base/media/CroppedImage.vue'

import { describe, beforeEach, expect, it } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('CroppedImage.vue', () => {
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      i18n,
      props: {
        src: 'test',
      },
    }
  })

  it('should render CroppedImage component', () => {
    const wrapper = lpiMount(CroppedImage, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
