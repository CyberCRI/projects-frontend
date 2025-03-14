import GroupProjectsTab from '@/pages/GroupPage/Tabs/GroupProjectsTab.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { loadLocaleMessages } from '@/../i18n.config'
import { DOMWrapper, flushPromises } from '@vue/test-utils'
import MockComponent from '@/../tests/helpers/MockComponent.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'

import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
}

const protoPropsLoading = () => ({
  projectsInitialRequest: {},

  isProjectsLoading: true,
})

const protoPropsLoaded = (projects = []) => ({
  projectsInitialRequest: { count: projects.length, results: projects },

  isProjectsLoading: false,
})

const buildParams = (props) => ({
  i18n,
  router: [
    { path: '/', name: 'home', component: MockComponent },
    { path: '/page404', name: 'page404', component: MockComponent },
  ],
  props,
})

describe('GroupProjectsTab', () => {
  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
    usersStore.$patch({
      id: 123,
      userFromApi: {},
      permissions: {},
      getUser: vi.fn(),
    } as any)
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.$patch({
      current: { code: 'TEST' } as unknown as OrganizationOutput,
    } as any)
  })
  it('should render GroupProjectsTab component', () => {
    let wrapper = lpiShallowMount(GroupProjectsTab, buildParams(protoPropsLoading()))

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should display project count when loaded', async () => {
    let wrapper = lpiShallowMount(GroupProjectsTab, buildParams(protoPropsLoading()))

    expect(wrapper.find('.projects-header .title span').exists()).toBe(false)

    wrapper.setProps(protoPropsLoaded([{ id: 1 }, { id: 2 }]))

    await wrapper.vm.$nextTick()

    let counter = wrapper.find('.projects-header .title span')

    expect(counter.exists()).toBe(true)

    expect(counter.html()).toContain('2')
  })
})
