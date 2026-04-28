import EmptyCard from '~/components/people/UserProfile/EmptyCard.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { lpiMount } from '~~/tests/helpers/LpiMount'

describe('EmptyCard.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        label: 'test',
      },
    }
  })

  it('should render EmptyCard component', () => {
    wrapper = lpiMount(EmptyCard, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
})
