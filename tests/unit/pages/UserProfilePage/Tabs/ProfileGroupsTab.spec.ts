import ProfileGroupsTab from '@/pages/UserProfilePage/Tabs/ProfileGroupsTab.vue'
import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import { UserFactory } from '@/../tests/factories/user.factory'
import { loadLocaleMessages } from '@/../tests/helpers/loadLocaleMessages'
import { flushPromises } from '@vue/test-utils'

import { getGroup } from '@/api/groups.service'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'
vi.mock('@/api/groups.service', () => ({
  getGroup: vi.fn().mockResolvedValue({ results: {} }),
}))

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

describe('ProfileGroupsTab', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = { id: 'TEST' } as unknown as OrganizationOutput
  })

  it('should render ProfileGroupsTab component', () => {
    let wrapper = lpiShallowMount(ProfileGroupsTab, buildParams(UserFactory.generate()))

    expect(wrapper.exists()).toBeTruthy()
  })
})
