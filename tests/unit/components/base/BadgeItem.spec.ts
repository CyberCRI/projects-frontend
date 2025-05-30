import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import BadgeItem from '@/components/base/BadgeItem.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
describe('BadgeItem', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        label: 'Badge',
      },
    }
  })

  it('should render BadgeItem component', () => {
    wrapper = lpiShallowMount(BadgeItem, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render label', () => {
    wrapper = lpiShallowMount(BadgeItem, defaultParams)

    const label = wrapper.find('.label')

    expect(label.exists()).toBeTruthy()
    expect(label.text()).toEqual('Badge')
  })

  it('should render icon component', () => {
    defaultParams.props.iconName = 'Account'
    wrapper = lpiShallowMount(BadgeItem, defaultParams)

    const icon = wrapper.find('.icon-container')

    expect(icon.exists()).toBeTruthy()
  })

  it('should find the small size selector', () => {
    defaultParams.props.size = 'small'
    wrapper = lpiShallowMount(BadgeItem, defaultParams)

    const size = wrapper.findAll('.small')
    const icon = wrapper.find('.icon-small')

    expect(size.length).toBe(2)
    expect(icon.exists).toBeTruthy()
  })

  it('should find the secondary selector', () => {
    defaultParams.props.secondary = true
    wrapper = lpiShallowMount(BadgeItem, defaultParams)

    const secondary = wrapper.find('.secondary')

    expect(secondary.exists).toBeTruthy()
  })
})
