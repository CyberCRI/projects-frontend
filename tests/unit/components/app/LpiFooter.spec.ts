import { lpiShallowMount, lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import LpiFooter from '@/components/app/LpiFooter.vue'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import { beforeEach, describe, expect, it } from 'vitest'
import MockComponent from '@/../tests/helpers/MockComponent.vue'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useOrganizationsStore from '@/stores/useOrganizations'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const router = [
  { path: '/', component: MockComponent },
  { path: '/help', component: MockComponent },
  { path: '/terms-of-service', component: MockComponent },
  { path: '/legal-notices', component: MockComponent },
  { path: '/cookies', component: MockComponent },
  { path: '/accessibility', component: MockComponent },
  { path: '/personal-data', component: MockComponent },
  { path: '/plan-de-continuite', component: MockComponent, name: 'pca-page' },
  { path: '/plan-de-securite', component: MockComponent, name: 'pssi-page' },
  { path: '/blank', component: MockComponent, name: 'blank' },
  {
    path: '/register',
    component: MockComponent,
    name: 'Register',
  },
]

describe('LpiFooter', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = OrganizationOutputFactory.generate()
    defaultParams = {
      i18n,
      router,
    }
  })

  it('should render LpiFooter component', () => {
    wrapper = lpiShallowMount(LpiFooter, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render full component', () => {
    const wrapper = lpiMount(LpiFooter, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
