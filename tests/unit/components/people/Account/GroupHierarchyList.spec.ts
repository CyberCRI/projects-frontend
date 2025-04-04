import GroupHierarchyList from '@/components/people/Account/GroupHierarchyList.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('GroupHierarchyList', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        isAddMode: true,
        selectedGroups: {},
      },
      i18n,
    }
  })

  it('should render GroupHierarchyList component', () => {
    wrapper = lpiShallowMount(GroupHierarchyList, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })
})
