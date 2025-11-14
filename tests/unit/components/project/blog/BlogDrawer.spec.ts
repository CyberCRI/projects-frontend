import { lpiMount, lpiShallowMount } from '@/../tests/helpers/LpiMount'
import BlogDrawer from '@/components/project/blog/BlogDrawer.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProjectOutputFactory } from '@/../tests/factories/project.factory'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { loadLocaleMessages } from '@/../tests/helpers/loadLocaleMessages'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
}

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

    const project = {
      ...ProjectOutputFactory.generate(),
      files: [],
      links: [],
    }
    defaultParams = {
      props: {
        isOpened: true,
        initialStep: 2,
        project: project,
      },
      i18n,
      provide: {
        projectLayoutProjectPatched: vi.fn(),
      },
    }
  })
  ;(it('should render component', () => {
    const wrapper = lpiMount(BlogDrawer, defaultParams)
    expect(wrapper.exists()).toBe(true)
  }),
    it('should emit the close event', () => {
      wrapper = lpiShallowMount(BlogDrawer, defaultParams)
      const vm: any = wrapper.vm

      vm.closeDrawer()
      expect(wrapper.emitted('close')).toBeTruthy()
    }))
})
