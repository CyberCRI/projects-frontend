import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import TakeTourModal from '~/components/onboarding/WelcomeModal/TakeTourModal.vue'
import useOrganizationsStore from '~/stores/useOrganizations'
import { beforeEach, describe, expect, it } from 'vitest'
import { lpiMount } from '~~/tests/helpers/LpiMount'
import pinia from '~/stores'

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
