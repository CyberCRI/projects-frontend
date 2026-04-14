import { lpiMount } from '@/../tests/helpers/LpiMount'
import ParentGroupSection from '@/components/group/GroupForm/ParentGroupSection.vue'
import { beforeEach, describe, expect, it } from 'vitest'

describe('ParentGroupSection.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
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
  })
  it('should emit the update:modelValue', () => {
    wrapper = lpiMount(ParentGroupSection, defaultParams)
    const vm: any = wrapper.vm

    vm.confirmGroup()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
