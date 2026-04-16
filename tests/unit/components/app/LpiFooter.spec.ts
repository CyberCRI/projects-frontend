import { lpiShallowMount, lpiMount } from '@/../tests/helpers/LpiMount'
import LpiFooter from '@/components/app/LpiFooter.vue'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { beforeEach, describe, expect, it } from 'vitest'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

describe('LpiFooter', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
  })

  it('should render LpiFooter component', () => {
    const wrapper = lpiShallowMount(LpiFooter)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render full component', () => {
    const wrapper = lpiMount(LpiFooter)
    expect(wrapper.exists()).toBe(true)
  })
})
