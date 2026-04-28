import ParentGroupSection from '~/components/group/GroupForm/ParentGroupSection.vue'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'

describe('ParentGroupSection.vue', () => {
  let defaultParams

  beforeEach(() => {
    const organizationCode = useOrganizationCode()
    const groups = {
      id: 123,
      name: '123',
      children: [],
      header_image: { variations: {} },
    }
    defaultParams = {
      props: {
        organizationCode,
        modelValue: {
          id: 123,
          name: '123',
          children: [],
          header_image: { variations: {} },
        },
      },
    }

    registerEndpoint(`organization/${organizationCode}/people-groups-hierarchy/`, () => {
      return groups
    })
  })

  it('should render ParentGroupSection component', async () => {
    const wrapper = await lpiMountSuspended(ParentGroupSection, defaultParams)
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })

  it('should emit the update:modelValue', async () => {
    const wrapper = await lpiMountSuspended(ParentGroupSection, defaultParams)
    await flushPromises()
    const vm: any = wrapper.vm

    vm.confirmGroup()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
