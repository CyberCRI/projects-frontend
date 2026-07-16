import ProfileSkillTab from '~/pages/UserProfilePageV2/Tabs/ProfileSkillTab.vue'
import { userTranslatedFactory } from '~~/tests/factories/user.factory'
import { lpiMountSuspended } from '~~/tests/helpers/LpiMount'
import useUsersStore from '~/stores/useUsers'

import { PaginationsFactory } from '~~/tests/factories/paginations.factory'
import UserSkillsFull from '~/components/people/skill/UserSkillsFull.vue'
import type { OrganizationOutput } from 'shared-projects-frontend/models'
import UserSkillFactory from '~~/tests/factories/skill.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import EmptyLabel from '~/components/base/EmptyLabel.vue'
import TagFactory from '~~/tests/factories/tag.factory'
import { flushTick } from '~~/tests/helpers/utils'
import { flushPromises } from '@vue/test-utils'

const aTag = TagFactory.generate({ title: '123', description: 'abc' })

describe('ProfileSkillTab', () => {
  let usersStore: ReturnType<typeof useUsersStore>
  beforeEach(() => {
    usersStore = useUsersStore()
    usersStore.userFromApi = {}
    usersStore.getUser = vi.fn()
    usersStore.userFromToken = {}
    const organizationCode = useOrganizationCode()
    const organizationsStore = useOrganizationsStore()
    organizationsStore._current = { id: 'TEST', code: 'TEST' } as unknown as OrganizationOutput

    registerEndpoint(`organization/${organizationCode}/mentoring/`, () => {
      return PaginationsFactory.generate()
    })
  })

  it('should render ProfileSkillTab component', async () => {
    const wrapper = await lpiMountSuspended(ProfileSkillTab, {
      props: { user: userTranslatedFactory.generate() },
    })
    await flushTick()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('should see that current user is the logged one', async () => {
    const user = userTranslatedFactory.generate({ id: 123 })

    registerEndpoint(`user/${user.id}/category-follow/`, () => PaginationsFactory.generate())

    usersStore.userFromApi = usersStore.userFromToken = user
    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeTruthy()
  })

  it('should see that current user is not the logged one', async () => {
    const user = userTranslatedFactory.generate()
    const user2 = userTranslatedFactory.generate()
    registerEndpoint(`user/${user.id}/category-follow/`, () => PaginationsFactory.generate())
    registerEndpoint(`user/${user2.id}/category-follow/`, () => PaginationsFactory.generate())

    usersStore.userFromApi = usersStore.userFromToken = user2

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    const vm: any = wrapper.vm
    expect(vm.isCurrentUser).toBeFalsy()
  })

  it('should display a message if no skill and no hobby', async () => {
    const user = userTranslatedFactory.generate()
    const user2 = userTranslatedFactory.generate()

    registerEndpoint(`user/${user.id}/category-follow/`, () => PaginationsFactory.generate())
    registerEndpoint(`user/${user2.id}/category-follow/`, () => PaginationsFactory.generate())
    usersStore.userFromApi = usersStore.userFromToken = user2

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    expect(wrapper.findComponent(EmptyLabel).exists()).toBe(true)
    expect(wrapper.findAllComponents(UserSkillsFull).length).toBe(0)
  })

  it('should display one list if user has skill but no hobby', async () => {
    const user = userTranslatedFactory.generate()
    const user2 = userTranslatedFactory.generate()

    registerEndpoint(`user/${user.id}/category-follow/`, () => PaginationsFactory.generate())
    registerEndpoint(`user/${user2.id}/category-follow/`, () => PaginationsFactory.generate())
    user.skills = [UserSkillFactory.generate({ id: 123, type: 'hobby', tag: aTag })]
    usersStore.userFromApi = usersStore.userFromToken = user2

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    expect(wrapper.findComponent(EmptyLabel).exists()).toBe(false)
    expect(wrapper.findAllComponents(UserSkillsFull).length).toBe(1)
  })

  it('should display one list if user has hobbies but no skills', async () => {
    const user = userTranslatedFactory.generate()
    const user2 = userTranslatedFactory.generate()

    registerEndpoint(`user/${user.id}/category-follow/`, () => PaginationsFactory.generate())
    registerEndpoint(`user/${user2.id}/category-follow/`, () => PaginationsFactory.generate())
    user.skills = [UserSkillFactory.generate({ id: 123, type: 'hobby', tag: aTag })]
    usersStore.userFromApi = usersStore.userFromToken = user2

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    expect(wrapper.findComponent(EmptyLabel).exists()).toBe(false)
    expect(wrapper.findAllComponents(UserSkillsFull).length).toBe(1)
  })

  it('should display two lists if user has hobbies and skills', async () => {
    const user = userTranslatedFactory.generate()
    const user2 = userTranslatedFactory.generate()

    registerEndpoint(`user/${user.id}/category-follow/`, () => PaginationsFactory.generate())
    registerEndpoint(`user/${user2.id}/category-follow/`, () => PaginationsFactory.generate())
    user.skills = [
      UserSkillFactory.generate({ id: 123, type: 'hobby', tag: aTag }),
      UserSkillFactory.generate({ id: 123, type: 'skill', tag: aTag }),
    ]
    usersStore.userFromApi = usersStore.userFromToken = user2

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    expect(wrapper.findComponent(EmptyLabel).exists()).toBe(false)
    expect(wrapper.findAllComponents(UserSkillsFull).length).toBe(2)
  })

  it('should display a tip if list are displayed', async () => {
    const user = userTranslatedFactory.generate()
    const user2 = userTranslatedFactory.generate()

    registerEndpoint(`user/${user.id}/category-follow/`, () => PaginationsFactory.generate())
    registerEndpoint(`user/${user2.id}/category-follow/`, () => PaginationsFactory.generate())
    user.skills = [
      UserSkillFactory.generate({ id: 123, type: 'hobby', tag: aTag }),
      UserSkillFactory.generate({ id: 123, type: 'skill', tag: aTag }),
    ]
    usersStore.userFromApi = usersStore.userFromToken = user2

    const wrapper = await lpiMountSuspended(ProfileSkillTab, { props: { user } })
    await flushPromises()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-test="skill-levels-help-button"]').exists()).toBe(true)
  })
})
