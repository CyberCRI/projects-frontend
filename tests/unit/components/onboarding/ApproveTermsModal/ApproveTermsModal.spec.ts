import { lpiMount } from '@/../tests/helpers/LpiMount'
import ApproveTermsModal from '@/components/onboarding/ApproveTermsModal/ApproveTermsModal.vue'

import { describe, expect, it } from 'vitest'

describe('ApproveTermsModal.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(ApproveTermsModal, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
