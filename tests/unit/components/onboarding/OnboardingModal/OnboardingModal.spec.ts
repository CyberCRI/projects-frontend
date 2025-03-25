import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import OnboardingModal from '@/components/onboarding/OnboardingModal/OnboardingModal.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
describe('BaseModal', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: { inititalStep: 1, stepNumber: 3 },
    }
  })

  it('should render BaseModal component', () => {
    wrapper = lpiShallowMount(OnboardingModal, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should should only step between bound', () => {
    wrapper = lpiShallowMount(OnboardingModal, defaultParams)
    const vm: any = wrapper.vm

    expect(vm.stepNumber).toBe(3)
    expect(vm.activeStep).toBe(1)
    vm.previous()
    expect(vm.activeStep).toBe(1)
    vm.next()
    expect(vm.activeStep).toBe(2)
    vm.next()
    expect(vm.activeStep).toBe(3)
    vm.next()
    expect(vm.activeStep).toBe(3)
    vm.previous()
    expect(vm.activeStep).toBe(2)
  })

  it('should should notify step change', () => {
    wrapper = lpiShallowMount(OnboardingModal, defaultParams)
    const vm: any = wrapper.vm

    expect(vm.activeStep).toBe(1)
    vm.next()
    expect(wrapper.emitted().stepped[0]).toEqual([2])
    vm.previous()
    expect(wrapper.emitted().stepped[1]).toEqual([1])
  })
})
