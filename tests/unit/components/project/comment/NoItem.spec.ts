import { lpiMount } from '@/../tests/helpers/LpiMount'
import NoItem from '@/components/project/comment/NoItem.vue'

import { describe, expect, it } from 'vitest'

describe('NoItem.vue', () => {
  it('should render and initialize the component with the default value', () => {
    const wrapper = lpiMount(NoItem)
    const vm: any = wrapper.vm

    expect(wrapper.exists()).toBe(true)
    expect(vm.message).toBe('')
  })

  it('should apply the settings passed by props', () => {
    const wrapper = lpiMount(NoItem, {
      props: {
        message: 'blog.no-entry',
      },
    })
    const vm: any = wrapper.vm

    expect(vm.message).toBe('blog.no-entry')
    expect(wrapper.find('.message').text()).toBe('No entry yet ...')
  })
})
