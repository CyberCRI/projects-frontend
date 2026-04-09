import { lpiMount } from '@/../tests/helpers/LpiMount'
import OnboardingTodo from '@/components/onboarding/OnboardingTodoBlock/OnboardingTodo.vue'

import { describe, expect, it } from 'vitest'

describe('OnboardingTodo.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(OnboardingTodo, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
