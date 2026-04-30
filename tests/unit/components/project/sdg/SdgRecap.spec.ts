import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SdgRecap from '~/components/project/sdg/SdgRecap.vue'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import pinia from '~/stores'

describe('SdgRecap.vue', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
  })
  it('should render component', () => {
    const wrapper = lpiShallowMount(SdgRecap, {
      provide: { projectLayoutToggleAddModal: vi.fn() },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
