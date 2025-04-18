import ProfileSkillTab from '@/pages/UserProfilePage/Tabs/ProfileSkillTab.vue'
import { lpiShallowMount, lpiMount } from '@/../tests/helpers/LpiMount'
import { UserFactory } from '@/../tests/factories/user.factory'
import { loadLocaleMessages } from '@/../tests/helpers/loadLocaleMessages'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
}

const buildParams = (user) => ({
  i18n,
  props: {
    user,
  },
})

const aTag = { title: '123', description: 'abc' }

describe('ProfileSkillTab', () => {
  let usersStore
  beforeEach(() => {
    usersStore = useUsersStore(pinia)
    usersStore.id = 123
    usersStore.userFromApi = {}
    usersStore.permissions = {}
    usersStore.getUser = vi.fn()
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = { id: 'TEST' } as unknown as OrganizationOutput
  })
  afterEach(() => {
    // usersStore.$reset()
  })

  it('should render ProfileSkillTab component', () => {
    let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(UserFactory.generate()))

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should see that current user is the logged one', () => {
    const id = '123'
    const user: any = UserFactory.generate()
    user.id = id

    usersStore.id = id
    let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
    let vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeTruthy()
  })

  it('should see that current user is not the logged one', () => {
    const user: any = UserFactory.generate()
    user.id = '123'

    usersStore.id = '456'

    let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
    let vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeFalsy()
  })

  it('should display a message if no kill and no hobby', () => {
    const user: any = UserFactory.generate()
    user.id = '123'

    usersStore.id = '456'

    let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
    let vm: any = wrapper.vm
    expect(wrapper.find('.empty-field').exists()).toBe(true)
    expect(wrapper.findAll('user-skills-full-stub').length).toBe(0)
  })

  it('should display one list if user has skill but no hobby', () => {
    const user: any = UserFactory.generate()
    user.id = '123'
    user.skills = [{ id: '123', type: 'skill', tag: aTag }]
    usersStore.id = '456'

    let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
    let vm: any = wrapper.vm
    expect(wrapper.find('.empty-field').exists()).toBe(false)
    expect(wrapper.findAll('user-skills-full-stub').length).toBe(1)
  })

  it('should display one list if user has hobbies but no skills', () => {
    const user: any = UserFactory.generate()
    user.id = '123'
    user.skills = [{ id: '123', type: 'hobby', tag: aTag }]
    usersStore.id = '456'

    let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
    let vm: any = wrapper.vm
    expect(wrapper.find('.empty-field').exists()).toBe(false)
    expect(wrapper.findAll('user-skills-full-stub').length).toBe(1)
  })

  it('should display two lists if user has hobbies and skills', () => {
    const user: any = UserFactory.generate()
    user.id = '123'
    user.skills = [
      { id: '123', type: 'skill', tag: aTag },
      { id: '123', type: 'hobby', tag: aTag },
    ]
    usersStore.id = '456'

    let wrapper = lpiShallowMount(ProfileSkillTab, buildParams(user))
    let vm: any = wrapper.vm
    expect(wrapper.find('.empty-field').exists()).toBe(false)
    expect(wrapper.findAll('user-skills-full-stub').length).toBe(2)
  })

  it('should display a tip if list are displayed', async () => {
    const user: any = UserFactory.generate()
    user.id = '123'
    user.skills = [
      { id: '123', type: 'skill', tag: aTag },
      { id: '123', type: 'hobby', tag: aTag },
    ]
    usersStore.id = '456'

    let wrapper = lpiMount(ProfileSkillTab, buildParams(user))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="skill-levels-help-button"]').exists()).toBe(true)
  })
})
