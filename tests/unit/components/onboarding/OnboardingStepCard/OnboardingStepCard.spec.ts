import { lpiMount } from '@/../tests/helpers/LpiMount'
import OnboardingStepCard from '@/components/onboarding/OnboardingStepCard/OnboardingStepCard.vue'
import english from '@/i18n/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const factory = (props?) => {
  return lpiMount(OnboardingStepCard, {
    props: {
      ...props,
    },
    i18n,
  })
}

describe('OnboardingStepCard.vue', () => {
  it('should render component', () => {
    const wrapper = factory()
    expect(wrapper.exists()).toBe(true)
  })
})
