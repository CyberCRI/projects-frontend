import UserProfilePreview from '~/components/people/UserProfilePreview.vue'
import { UserFactory } from '~~/tests/factories/user.factory'
import { lpiShallowMount } from '~~/tests/helpers/LpiMount'
import { flushPromises } from '@vue/test-utils'

import { beforeAll, beforeEach, describe, expect, it } from 'vitest'

import useOrganizationsStore from '~/stores/useOrganizations'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import useUsersStore from '~/stores/useUsers'
import pinia from '~/stores'

const route = {
  name: 'ProfileUser',
}

const buildParams = (userId: number, showPageLink: boolean) => ({
  props: {
    userId, // UserFactory.generate(),
    showPageLink,
  },
  global: {
    mocks: {
      $route: route,
    },
  },
})

describe('UserProfilePreview', () => {
  let usersStore
  const user = UserFactory.generate()
  const user2 = UserFactory.generate()

  beforeAll(() => {
    registerEndpoint(`user/${user.id}/`, () => user)
    registerEndpoint(`user/${user2.id}/`, () => user2)

    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.$patch({ _current: { id: 'TEST' } as any })
    usersStore = useUsersStore()
  })

  beforeEach(() => {
    usersStore.userFromApi = usersStore.userFromToken = user
  })

  it('should render UserProfilePreview component', () => {
    const wrapper = lpiShallowMount(UserProfilePreview, buildParams(user.id, false))

    expect(wrapper.exists()).toBeTruthy()
  })

  it("should emit 'user-not-found' if no user found", async () => {
    registerEndpoint(`user/123333/`, () => {
      throw createError({ statusCode: 404 })
    })
    const wrapper = lpiShallowMount(UserProfilePreview, buildParams(123333, false))

    await flushPromises()
    expect(wrapper.emitted()['user-not-found']).toBeTruthy()
  })
})
