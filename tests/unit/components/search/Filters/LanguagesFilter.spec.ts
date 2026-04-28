import LanguageFilter from '~/components/search/Filters/LanguageFilter.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import useOrganizationsStore from '~/stores/useOrganizations'
import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import pinia from '~/stores'

describe('LanguageFilter.vue', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore._current = { code: 'TEST', languages: ['en', 'fr'] } as any
  })
  it('should render component', () => {
    const wrapper = lpiMount(LanguageFilter, { props: { modelValue: [] } })
    expect(wrapper.exists()).toBe(true)
  })

  it('should display english and french buttons', () => {
    const wrapper = lpiMount(LanguageFilter, { props: { modelValue: [] } })
    const buttonContainers = wrapper.findAll('.lpi-checkbox')

    expect(buttonContainers.length).toBe(2)
  })

  it('should emit event update is triggered', async () => {
    const wrapper = lpiMount(LanguageFilter, { props: { modelValue: [] } })
    const buttonContainer = wrapper.find('[type=checkbox]')
    ;(buttonContainer as any).setChecked()
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
