import { lpiMount } from '@/../tests/helpers/LpiMount'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const factory = (props?) => {
  return lpiMount(PaginationButtons, {
    props: {
      total: 50,
      current: 1,
      pagination: {
        next: 'next-page-link',
        previous: 'previous-page-link',
        first: 'first-page-link',
        last: 'last-page-link',
      },
      ...props,
    },
  })
}

describe('PaginationButtons.vue', () => {
  it('should render component', () => {
    const wrapper = factory()
    expect(wrapper.exists()).toBe(true)
  })

  it('should not emit update pagination event when clicking on dots', () => {
    const wrapper = factory()
    const vm: any = wrapper.vm

    vm.updatePage('...')

    expect(wrapper.emitted('update-pagination')).toBeFalsy()
  })

  it('should emit update pagination event when clicking next page', () => {
    const wrapper = factory()
    const vm: any = wrapper.vm

    vm.goToPage('next')
    expect(wrapper.emitted('update-pagination')).toBeTruthy()
  })

  it('should emit update pagination event when clicking previous page', () => {
    const wrapper = factory()
    const vm: any = wrapper.vm

    vm.goToPage('previous')
    expect(wrapper.emitted('update-pagination')).toBeTruthy()
  })

  it('should emit update pagination event when clicking first page', () => {
    const wrapper = factory()
    const vm: any = wrapper.vm

    vm.goToPage('first')
    expect(wrapper.emitted('update-pagination')).toBeTruthy()
  })

  it('should emit update pagination event when clicking last page', () => {
    const wrapper = factory()
    const vm: any = wrapper.vm

    vm.goToPage('last')
    expect(wrapper.emitted('update-pagination')).toBeTruthy()
  })

  it('should display an ellipsis before current page if current is greater than 3', () => {
    const wrapper = factory({ current: 4 })
    const vm: any = wrapper.vm

    expect(vm.pages[1]).toStrictEqual({ value: '...' })
  })

  it('should not display an ellipsis before current page if current is equal to 3', () => {
    const wrapper = factory({ current: 3 })
    const vm: any = wrapper.vm

    expect(vm.pages[1]).toStrictEqual({ value: 2, current: false })
  })

  it('should not display an ellipsis before current page if current is less than 3', () => {
    const wrapper = factory({ current: 2 })
    const vm: any = wrapper.vm

    expect(vm.pages[1]).toStrictEqual({ value: 2, current: true })
  })

  it('should display an ellipsis after current page if total - current is greater than 2', () => {
    const wrapper = factory({ current: 10 })
    const vm: any = wrapper.vm

    expect(vm.pages[vm.pages.length - 2]).toStrictEqual({ value: '...' })
  })

  it('should not display an ellipsis after current page if total - current is equal to 2', () => {
    const wrapper = factory({ current: 48 })
    const vm: any = wrapper.vm

    expect(vm.pages[vm.pages.length - 2]).toStrictEqual({ value: 49, current: false })
  })

  it('should not display an ellipsis after current page if total - current is less than 2', () => {
    const wrapper = factory({ current: 49 })
    const vm: any = wrapper.vm

    expect(vm.pages[vm.pages.length - 2]).toStrictEqual({ value: 49, current: true })
  })
})
