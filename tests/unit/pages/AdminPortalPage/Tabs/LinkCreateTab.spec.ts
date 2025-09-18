import { lpiMount } from '@/../tests/helpers/LpiMount'
import LinkCreateTab from '@/pages/AdminPortalPageV2/Tabs/LinkCreateTab.vue'
import english from '@/i18n/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MockComponent from '@/../tests/helpers/MockComponent.vue'
import useAPI from '@/composables/useAPI'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

import type { OrganizationOutput, OrganizationPatchInput } from '@/models/organization.model'

// fix unhnadled rejection due to invalid url
vi.mock('@/composables/useAPI', () => {
  return {
    default: vi.fn().mockResolvedValue({ data: { results: [] } }), // TODO nuxt check this
  }
})

vi.mock('@/api/invitations.service.ts', () => {
  return {
    getInvitations: vi.fn(() => ({ results: [] })),
    postInvitations: vi.fn(),
    deleteInvitations: vi.fn(),
  }
})

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const factory = (props?) => {
  return lpiMount(LinkCreateTab, {
    props,
    i18n,
    router: [
      { name: 'Home', path: '/', component: MockComponent },
      { name: 'Help', path: '/help', component: MockComponent },
      { path: '/blank', component: MockComponent, name: 'blank' },
    ],
  })
}

describe('LinkCreateTab.vue', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { code: 'FOOBAR' } as unknown as OrganizationOutput
  })

  it('should mount the component', () => {
    const wrapper = factory({ projects: [] })
    const vm: any = wrapper.vm
    expect(wrapper.exists()).toBeTruthy()
  })
})
