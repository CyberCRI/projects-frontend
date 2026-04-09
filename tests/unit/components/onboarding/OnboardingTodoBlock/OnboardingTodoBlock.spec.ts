import { lpiMount } from '@/../tests/helpers/LpiMount'
import OnboardingTodoBlock from '@/components/onboarding/OnboardingTodoBlock/OnboardingTodoBlock.vue'

import { describe, expect, it } from 'vitest'

describe('OnboardingTodoBlock.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(OnboardingTodoBlock, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
