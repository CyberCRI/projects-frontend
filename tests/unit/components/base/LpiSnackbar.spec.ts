import { lpiMount } from '@/../tests/helpers/LpiMount'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'

import { describe, expect, it } from 'vitest'

describe('LpiSnackbar.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(LpiSnackbar, { props: { text: 'test' } })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits close event', () => {
    const wrapper = lpiMount(LpiSnackbar, { props: { text: 'test' } })

    // @ts-expect-error ignore
    wrapper.vm.close()
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should display check icon', () => {
    const wrapper = lpiMount(LpiSnackbar, {
      props: { text: 'test', icon: 'Check', type: 'success' },
    })

    expect(wrapper.find('.left-icon').exists()).toBe(true)
  })

  it('should not display check icon if type is not success', () => {
    const wrapper = lpiMount(LpiSnackbar, { props: { text: 'test', type: 'error' } })

    expect(wrapper.find('.left-icon').exists()).toBe(false)
  })

  it('should not display check icon if snackbar does not have icon', () => {
    const wrapper = lpiMount(LpiSnackbar, { props: { text: 'test', type: 'success' } })

    expect(wrapper.find('.left-icon').exists()).toBe(false)
  })

  it('should display exclamation icon', () => {
    const wrapper = lpiMount(LpiSnackbar, {
      props: { text: 'test', icon: 'ExclamationMark', type: 'error' },
    })

    expect(wrapper.find('.left-icon').exists()).toBe(true)
  })

  it('should not display check icon if type is not error or warning', () => {
    const wrapper = lpiMount(LpiSnackbar, { props: { text: 'test', type: 'success' } })

    expect(wrapper.find('.left-icon').exists()).toBe(false)
  })

  it('should not display check icon if snackbar does not have icon', () => {
    const wrapper = lpiMount(LpiSnackbar, { props: { text: 'test', type: 'error' } })

    expect(wrapper.find('.left-icon').exists()).toBe(false)
  })

  it('should display question mark', () => {
    const wrapper = lpiMount(LpiSnackbar, {
      props: { text: 'test', icon: 'QuestionMark', type: 'info' },
    })

    expect(wrapper.find('.left-icon').exists()).toBe(true)
  })

  it('should not display check icon if type is not info', () => {
    const wrapper = lpiMount(LpiSnackbar, { props: { text: 'test', type: 'success' } })

    expect(wrapper.find('.left-icon').exists()).toBe(false)
  })

  it('should not display check icon if snackbar does not have icon', () => {
    const wrapper = lpiMount(LpiSnackbar, { props: { text: 'test', type: 'info' } })

    expect(wrapper.find('.left-icon').exists()).toBe(false)
  })
})
