import { ProjectOutputFactory, TranslatedProjectFactory } from '~~/tests/factories/project.factory'
import { OrganizationOutputFactory } from '~~/tests/factories/organization.factory'
import BlogDrawer from '~/components/project/modules/BlogEntries/BlogDrawer.vue'
import { lpiMount, lpiShallowMount } from '~~/tests/helpers/LpiMount'
import useOrganizationsStore from '~/stores/useOrganizations'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useUsersStore from '~/stores/useUsers'
import pinia from '~/stores'

describe('BlogDrawer.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
    usersStore.$patch({
      id: 123,
      userFromApi: {},
      permissions: {},
      getUser: vi.fn(),
    } as any)
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = OrganizationOutputFactory.generate()

    const project = TranslatedProjectFactory.generate()
    defaultParams = {
      props: {
        isOpened: true,
        initialStep: 2,
        project: project,
      },
      provide: {
        projectLayoutProjectPatched: vi.fn(),
      },
    }
  })
  it('should render component', () => {
    const wrapper = lpiMount(BlogDrawer, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
  it('should emit the close event', () => {
    wrapper = lpiShallowMount(BlogDrawer, defaultParams)
    const vm: any = wrapper.vm

    vm.close()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
