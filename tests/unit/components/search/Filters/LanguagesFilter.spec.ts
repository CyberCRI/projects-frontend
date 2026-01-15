import { lpiMount } from '@/../tests/helpers/LpiMount'
import LanguageFilter from '@/components/search/Filters/LanguageFilter.vue'
import english from '@/i18n/locales/en.json'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'
import flushPromises from 'flush-promises'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const factory = (props?) => {
  return lpiMount(LanguageFilter, {
    props: {
      ...props,
    },
    i18n,
  })
}

describe('LanguageFilter.vue', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { code: 'TEST', languages: ['en', 'fr'] } as any
  })
  it('should render component', () => {
    const wrapper = factory({ modelValue: [] })
    expect(wrapper.exists()).toBe(true)
  })

  it('should display english and french buttons', () => {
    const wrapper = factory({ modelValue: [] })
    const buttonContainers = wrapper.findAll('.lpi-checkbox')

    expect(buttonContainers.length).toBe(2)
  })

  it('should emit event update is triggered', async () => {
    const wrapper = factory({ modelValue: [] })
    const buttonContainer = wrapper.find<HTMLInputElement>('[type=checkbox]')
    // buttonContainer.set
    ;(buttonContainer as any).setChecked()
    await wrapper.vm.$nextTick()
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
