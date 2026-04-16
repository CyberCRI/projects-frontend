import { lpiMount } from '@/../tests/helpers/LpiMount'
import ProfileEditBlock from '@/components/people/CompleteProfileDrawer/ProfileEditBlock.vue'

import { beforeEach, describe, expect, it } from 'vitest'

describe('CompleteProfileStep1.vue', () => {
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        blockTitle: 'test',
      },
    }
  })

  it('should render component', () => {
    const wrapper = lpiMount(ProfileEditBlock, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
