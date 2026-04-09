import { lpiMount } from '@/../tests/helpers/LpiMount'
import TemplateForm from '@/components/templates/TemplateForm.vue'

import { describe, expect, it } from 'vitest'

describe('TemplateForm.vue', () => {
  it('should render component', async () => {
    const props = {}

    const wrapper = lpiMount(TemplateForm, { props })
    expect(wrapper.exists()).toBe(true)
  })
})
