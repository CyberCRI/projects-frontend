import ProfileSkillTab from '~/pages/UserProfilePageV2/Tabs/ProfileSkillTab.vue'
import { OrganizationOutput } from '~/models/organization.model'
import { UserFactory } from '~~/tests/factories/user.factory'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import useOrganizationsStore from '~/stores/useOrganizations'
import useUsersStore from '~/stores/useUsers'
import pinia from '~/stores'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import UserSkillsFull from '~/components/people/skill/UserSkillsFull.vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import EmptyLabel from '~/components/base/EmptyLabel.vue'
import { flushPromises } from '@vue/test-utils'

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
    organizationsStore._current = { id: 'TEST', code: 'TEST' } as unknown as OrganizationOutput

    registerEndpoint(`organization/${organizationsStore._current.code}/mentoring`, () => {
      return PaginationsFactory.generate()
    })
  })

  it('should render ProfileSkillTab component', async () => {
    const wrapper = await lpiMountSuspended(ProfileSkillTab, {
      props: { user: UserFactory.generate() },
    })
    await flushPromises()

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should see that current user is the logged one', async () => {
    const id = '123'
    const user: any = UserFactory.generate()
    user.id = id

    usersStore.id = id
    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeTruthy()
  })

  it('should see that current user is not the logged one', async () => {
    const user: any = UserFactory.generate()
    user.id = '123'

    usersStore.id = '456'

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeFalsy()
  })

  it('should display a message if no kill and no hobby', async () => {
    const user: any = UserFactory.generate()
    user.id = '123'

    usersStore.id = '456'

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    expect(wrapper.findComponent(EmptyLabel).exists()).toBe(true)
    expect(wrapper.findAllComponents(UserSkillsFull).length).toBe(0)
  })

  it('should display one list if user has skill but no hobby', async () => {
    const user: any = UserFactory.generate()
    user.id = '123'
    user.skills = [{ id: '123', type: 'skill', tag: aTag }]
    usersStore.id = '456'

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    expect(wrapper.findComponent(EmptyLabel).exists()).toBe(false)
    expect(wrapper.findAllComponents(UserSkillsFull).length).toBe(1)
  })

  it('should display one list if user has hobbies but no skills', async () => {
    const user: any = UserFactory.generate()
    user.id = '123'
    user.skills = [{ id: '123', type: 'hobby', tag: aTag }]
    usersStore.id = '456'

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    expect(wrapper.findComponent(EmptyLabel).exists()).toBe(false)
    expect(wrapper.findAllComponents(UserSkillsFull).length).toBe(1)
  })

  it('should display two lists if user has hobbies and skills', async () => {
    const user: any = UserFactory.generate()
    user.id = '123'
    user.skills = [
      { id: '123', type: 'skill', tag: aTag },
      { id: '123', type: 'hobby', tag: aTag },
    ]
    usersStore.id = '456'

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    expect(wrapper.findComponent(EmptyLabel).exists()).toBe(false)
    expect(wrapper.findAllComponents(UserSkillsFull).length).toBe(2)
  })

  it('should display a tip if list are displayed', async () => {
    const user: any = UserFactory.generate()
    user.id = '123'
    user.skills = [
      { id: '123', type: 'skill', tag: aTag },
      { id: '123', type: 'hobby', tag: aTag },
    ]
    usersStore.id = '456'

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="skill-levels-help-button"]').exists()).toBe(true)
  })
})
