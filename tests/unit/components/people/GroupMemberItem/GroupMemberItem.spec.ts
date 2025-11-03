import { lpiMount, lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import GroupMemberItem from '@/components/people/GroupMemberItem/GroupMemberItem.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import GroupMemberFactory from '@/../tests/factories/group-member.factory'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('GroupMemberItem.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      i18n,
      props: {
        user: GroupMemberFactory.generate(),
      },
    }
  })
  ;(it('should render GroupMemberItem component', () => {
    wrapper = lpiMount(GroupMemberItem, defaultParams)
    expect(wrapper.exists()).toBe(true)
  }),
    it('should emit user-click event when clicking close', async () => {
      wrapper = lpiShallowMount(GroupMemberItem, defaultParams)
      const closeButton = wrapper.find('.user')

      expect(closeButton.exists()).toBeTruthy()

      closeButton.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('user-click')).toBeTruthy()
    }))
})
