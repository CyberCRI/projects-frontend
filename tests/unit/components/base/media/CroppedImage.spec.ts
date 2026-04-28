import { lpiMount } from '~~/tests/helpers/LpiMount'
import CroppedImage from '~/components/base/media/CroppedImage.vue'

import { describe, beforeEach, expect, it } from 'vitest'
describe('CroppedImage.vue', () => {
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        src: 'test',
      },
    }
  })

  it('should render CroppedImage component', () => {
    const wrapper = lpiMount(CroppedImage, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
