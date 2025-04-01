import { lpiMount } from '@/../tests/helpers/LpiMount'
import CardList from '@/components/base/CardList.vue'
import { ProjectFactory } from '@/../tests/factories/project.factory'
import english from '@/i18n/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const projects = ProjectFactory.generateMany(4)

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const factory = (props?) => {
  return lpiMount(CardList, {
    props,
    i18n,
  })
}

describe('CardList.vue', () => {
  it('should initialize the component with the default values', () => {
    const wrapper = factory({ items: [] })
    const vm: any = wrapper.vm
    expect(wrapper.exists()).toBeTruthy()
    expect(vm.items).toStrictEqual([])
    expect(vm.isLoading).toBe(false)
  })

  it('should show an empty box image and not show projects if there are no projects', () => {
    const wrapper = factory({ items: [] })
    expect(wrapper.find('.card-list__empty').exists()).toBe(true)
    expect(wrapper.find('.card-list__content').exists()).toBe(false)
  })

  it('should not show an empty box image and show projects if there are projects', () => {
    const wrapper = factory({ items: projects })
    expect(wrapper.find('.card-list__empty').exists()).toBe(false)
    expect(wrapper.find('.card-list__content').exists()).toBe(true)
  })
})
