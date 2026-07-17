import AccountDrawer from '~/components/people/Account/AccountDrawer.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import {
  OrganizationFactory,
  OrganizationOutputFactory,
} from '~~/tests/factories/organization.factory'
import ExistingAccountChecker from '~/components/people/Account/ExistingAccountChecker.vue'
import AccountLayout from '~/components/people/Account/AccountLayout.vue'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { UserFactory } from '~~/tests/factories/user.factory'
import useOrganizationsStore from '~/stores/useOrganizations'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { flushTick } from '~~/tests/helpers/utils'
import { flushPromises } from '@vue/test-utils'

describe('AccountDrawer', () => {
  let defaultProps

  beforeAll(() => {
    const organizationStore = useOrganizationsStore()
    const organization = OrganizationFactory.generate()
    organizationStore._current = organization
    registerEndpoint(`organization/`, () => ({ results: [organization] }))
  })

  beforeEach(() => {
    vi.resetModules()
    defaultProps = {
      isAddMode: true,
      isInviteMode: false,
    }
  })

  it('AddMode', async () => {
    const email = 'test@protonmail.com'
    registerEndpoint(`user/get-by-email/${email}/`, () => {
      throw createError({ statusCode: 404 })
    })

    const wrapper = await lpiMount(AccountDrawer, { props: defaultProps })
    expect(wrapper.findComponent(ExistingAccountChecker).exists()).toBe(true)
    expect(wrapper.findComponent(AccountLayout).exists()).toBe(false)
  })

  it('AddMode email not exists', async () => {
    const email = 'test@protonmail.com'
    registerEndpoint(`user/get-by-email/${email}/`, () => {
      throw createError({ statusCode: 404 })
    })

    const organizationStore = useOrganizationsStore()
    registerEndpoint(
      `organization/${organizationStore.current.code}/people-groups-hierarchy/`,
      () => organizationStore.current
    )

    const wrapper = await lpiMount(AccountDrawer, { props: defaultProps })

    const input = wrapper.get<HTMLInputElement>('input[type="email"]')
    await input.setValue(email)

    const confirm = wrapper.get<HTMLButtonElement>('[data-test="confirm-button"]')
    await confirm.element.click()

    await flushPromises()

    expect(wrapper.findComponent(ExistingAccountChecker).exists()).toBe(false)
    expect(wrapper.findComponent(AccountLayout).exists()).toBe(true)

    // email not exists so create user
    expect(wrapper.findComponent(AccountLayout).text()).contain('Create an account')
  })

  it('AddMode email exists', async () => {
    const props = {
      ...defaultProps,
    }
    const user = UserFactory.generate()

    registerEndpoint(`user/${user.id}/`, () => user)
    registerEndpoint(`user/get-by-email/${user.email}/`, () => {
      return user
    })

    const wrapper = await lpiMount(AccountDrawer, { props })

    const input = wrapper.get<HTMLInputElement>('input[type="email"]')
    await input.setValue(user.email)

    const confirm = wrapper.get<HTMLButtonElement>('[data-test="confirm-button"]')
    await confirm.element.click()

    await flushTick(10)

    expect(wrapper.findComponent(AccountLayout).exists()).toBe(true)

    // email exists so update/add account
    expect(wrapper.findComponent(AccountLayout).text()).contain('Add an account')
  })

  it('inviteMode', async () => {
    const props = {
      ...defaultProps,
      isAddMode: false,
      isInviteMode: true,
      selectedUser: UserFactory.generate(),
    }
    const organization = OrganizationOutputFactory.generate()
    registerEndpoint(`user/${props.selectedUser.id}/`, () => props.selectedUser)
    registerEndpoint(`organization/`, () => ({ results: [organization] }))
    const email = props.selectedUser.email
    registerEndpoint(`user/get-by-email/${email}/`, () => {
      throw createError({ statusCode: 404 })
    })

    const wrapper = await lpiMount(AccountDrawer, {
      props,
    })
    expect(wrapper.findComponent(ExistingAccountChecker).exists()).toBe(false)
    expect(wrapper.findComponent(AccountLayout).exists()).toBe(true)
  })
})
