import AccountDrawer from '@/components/people/Account/AccountDrawer.vue'
import { lpiMount } from '@/../tests/helpers/LpiMount'

import { beforeEach, describe, expect, it } from 'vitest'
import { UserFactory } from '@/../tests/factories/user.factory'
import ExistingAccountChecker from '@/components/people/Account/ExistingAccountChecker.vue'
import AccountLayout from '@/components/people/Account/AccountLayout.vue'
import { registerEndpoint } from '@nuxt/test-utils/runtime'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import { flushPromises } from '@vue/test-utils'

describe('AccountDrawer', () => {
  let defaultProps

  beforeEach(() => {
    defaultProps = {
      isAddMode: true,
      isInviteMode: false,
    }
  })

  it('AddMode', async () => {
    const wrapper = await lpiMount(AccountDrawer, { props: defaultProps })
    expect(wrapper.findComponent(ExistingAccountChecker).exists()).toBe(true)
    expect(wrapper.findComponent(AccountLayout).exists()).toBe(false)
  })

  it('AddMode email not exists', async () => {
    const email = 'test@protonmail.com'
    registerEndpoint(`user/get-by-email/${email}/`, () => {
      throw createError({ statusCode: 404 })
    })

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
    const organization = OrganizationOutputFactory.generate()

    registerEndpoint(`user/${user.id}/`, () => user)
    registerEndpoint(`user/get-by-email/${user.email}/`, () => user)
    registerEndpoint(`organization/`, () => ({ results: [organization] }))

    const wrapper = await lpiMount(AccountDrawer, { props })

    const input = wrapper.get<HTMLInputElement>('input[type="email"]')
    await input.setValue(user.email)

    const confirm = wrapper.get<HTMLButtonElement>('[data-test="confirm-button"]')
    await confirm.element.click()

    await flushPromises()
    await flushPromises()

    expect(wrapper.findComponent(ExistingAccountChecker).exists()).toBe(false)
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

    const wrapper = await lpiMount(AccountDrawer, {
      props,
    })
    expect(wrapper.findComponent(ExistingAccountChecker).exists()).toBe(false)
    expect(wrapper.findComponent(AccountLayout).exists()).toBe(true)
  })
})
