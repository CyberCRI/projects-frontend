import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupHeader from '@/components/group/Modules/GroupHeader.vue'
import english from '@/i18n/locales/en.json'
import { beforeEach, describe, expect, it } from 'vitest'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('GroupHeaderV2.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      i18n,
      props: {
        title: '123',
        image: {
          id: 0,
          name: 'string',
          url: 'string',
          height: 2147483647,
          width: 2147483647,
          created_at: '2022-06-28T09:59:48.743Z',
          variations: { medium: 'string.jpeg' },
        },
        visibility: 'public',
        email: 'string',
        isLoading: false,
        shortDescription: 'string',
      },
    }
  })

  it('should render GroupHeaderV2 component', () => {
    wrapper = lpiMount(GroupHeader, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
