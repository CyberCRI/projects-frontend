import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import GoalsRecap from '@/components/project/goal/GoalsRecap.vue'
import { GoalFactory } from '@/../tests/factories/goal.factory'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('GoalRecap.vue', () => {
  it('should render component', () => {
    const wrapper = lpiShallowMount(GoalsRecap, {
      props: {
        goals: GoalFactory.generateMany(3),
      },
      i18n,
    })
    expect(wrapper.exists()).toBe(true)
  })
})
