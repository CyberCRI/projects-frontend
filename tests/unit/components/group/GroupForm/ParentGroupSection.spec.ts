import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import ParentGroupSection from '@/components/group/GroupForm/ParentGroupSection.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import useValidate from '@vuelidate/core'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('ParentGroupSection.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      i18n,
      props: {
        modelValue: {
          id: 123,
          name: '123',
          children: [],
          header_image: { variations: {} },
        },

        groups: [
          {
            id: 123,
            name: '123',
            children: [],
            header_image: { variations: {} },
          },
          ,
          {
            id: 2,
            name: '2',
            children: [],
            header_image: { variations: {} },
          },
          ,
          {
            id: 3,
            name: '3',
            children: [],
            header_image: { variations: {} },
          },
        ],
      },
    }
  })

  it('should render ParentGroupSection component', () => {
    wrapper = lpiMount(ParentGroupSection, defaultParams)
    expect(wrapper.exists()).toBe(true)
  }),
    it('should emit the update:modelValue', () => {
      wrapper = lpiMount(ParentGroupSection, defaultParams)
      const vm: any = wrapper.vm

      vm.confirmGroup()
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
})
