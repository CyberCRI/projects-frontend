import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import GroupButton from '@/components/base/button/GroupButton.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const stubs = {
  IconImage: true,
}

describe('GroupButton', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        options: [
          {
            value: 'button1',
            label: 'button 1',
            iconName: 'ExclamationMark',
          },
          {
            value: 'button2',
            label: 'button 2',
            iconName: 'Close',
          },
          {
            value: 'button3',
            label: 'button 3',
            iconName: 'Check',
          },
        ],
        size: 'default',
      },
      stubs,
    }
  })

  it('should render GroupButton component', () => {
    wrapper = lpiShallowMount(GroupButton, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should render each button component', () => {
    wrapper = lpiShallowMount(GroupButton, defaultParams)
    const vm: any = wrapper.vm

    const buttonContainers = wrapper.findAll('.button-container')
    expect(buttonContainers.length).toBe(3)
    expect(vm.options.length).toBe(3)
  })

  it('should render the size', () => {
    defaultParams.props.size = 's-small'
    wrapper = lpiShallowMount(GroupButton, defaultParams)

    const size = wrapper.find('.s-small')

    expect(size.exists()).toBeTruthy()
  })
})
