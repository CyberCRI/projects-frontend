import { lpiMount, lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import TakeTourModal from '@/components/onboarding/WelcomeModal/TakeTourModal.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import MockComponent from '@/../tests/helpers/MockComponent.vue'
import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('TakeTourModal.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = OrganizationOutputFactory.generate()
    defaultParams = {
      i18n,
      router: [
        {
          path: '/',
          component: MockComponent,
          name: 'Home',
        },
        { path: '/tutorials', name: 'HelpVideoTab', component: MockComponent },
      ],
    }
  })

  it('should render TakeTourModal component', () => {
    wrapper = lpiMount(TakeTourModal, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
