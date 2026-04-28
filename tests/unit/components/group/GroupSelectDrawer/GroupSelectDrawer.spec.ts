import { lpiMount } from '~~/tests/helpers/LpiMount'
import GroupSelectDrawer from '~/components/group/GroupSelectDrawer/GroupSelectDrawer.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import pinia from '~/stores'
import useOrganizationsStore from '~/stores/useOrganizations'

describe('GroupSelectDrawer.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()
    defaultParams = {
      props: {
        isOpened: false,
      },
    }
  })

  it('should render GroupSelectDrawer component', () => {
    wrapper = lpiMount(GroupSelectDrawer, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
