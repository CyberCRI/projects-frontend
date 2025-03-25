import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import BaseModal from '@/components/base/modal/BaseModal.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
describe('BaseModal', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {},
    }
  })

  it('should render BaseModal component', () => {
    wrapper = lpiShallowMount(BaseModal, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should emit the close event', async () => {
    wrapper = lpiShallowMount(BaseModal, defaultParams)
    const vm: any = wrapper.vm

    await vm.close()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
