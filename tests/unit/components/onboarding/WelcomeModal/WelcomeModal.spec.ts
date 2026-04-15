import { lpiMount } from '@/../tests/helpers/LpiMount'
import WelcomedModal from '@/components/onboarding/WelcomeModal/WelcomeModal.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

describe('WelcomedModal.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
    defaultParams = {}
  })

  it('should render WelcomedModal component', () => {
    wrapper = lpiMount(WelcomedModal, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
