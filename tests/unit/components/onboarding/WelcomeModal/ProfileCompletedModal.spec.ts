import ProfileCompletedModal from '~/components/onboarding/WelcomeModal/ProfileCompletedModal.vue'
import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import { lpiMount, lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { beforeEach, describe, expect, it } from 'vitest'

import useOrganizationsStore from '~/stores/useOrganizations'
import pinia from '~/stores'

describe('ProfileCompletedModal.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
    defaultParams = {}
  })
  it('should render ProfileCompletedModal component', () => {
    wrapper = lpiMount(ProfileCompletedModal, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
  it('should emit the close event', () => {
    wrapper = lpiShallowMount(ProfileCompletedModal, defaultParams)
    const vm: any = wrapper.vm

    vm.skip()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
  it('should emit the take-tour event', () => {
    wrapper = lpiShallowMount(ProfileCompletedModal, defaultParams)
    const vm: any = wrapper.vm

    vm.takeTour()
    expect(wrapper.emitted('take-tour')).toBeTruthy()
  })
})
