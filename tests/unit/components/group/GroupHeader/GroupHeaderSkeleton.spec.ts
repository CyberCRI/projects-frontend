import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import GroupHeaderSkeleton from '@/components/group/GroupHeader/GroupHeaderSkeleton.vue'
import { beforeEach, describe, expect, it } from 'vitest'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('GroupHeader.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      i18n,
    }
  })

  it('should render GroupHeader component', () => {
    wrapper = lpiMount(GroupHeaderSkeleton, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
