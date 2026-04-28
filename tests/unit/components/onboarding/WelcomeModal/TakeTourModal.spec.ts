import { lpiMount } from '~~/tests/helpers/LpiMount'
import TakeTourModal from '~/components/onboarding/WelcomeModal/TakeTourModal.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import pinia from '~/stores'
import useOrganizationsStore from '~/stores/useOrganizations'

describe('TakeTourModal.vue', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
  })

  it('should render TakeTourModal component', () => {
    const wrapper = lpiMount(TakeTourModal)
    expect(wrapper.exists()).toBe(true)
  })
})
