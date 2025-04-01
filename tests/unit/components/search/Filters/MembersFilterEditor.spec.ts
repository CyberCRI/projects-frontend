import { lpiMount } from '@/../tests/helpers/LpiMount'
import MembersFilterEditor from '@/components/search/Filters/MembersFilterEditor.vue'
import PeopleFactory from '@/../tests/factories/people.factory'
import { OrganizationOutputFactory } from '@/../tests/factories/organization.factory'
import english from '@/i18n/locales/en.json'
import { searchPeopleProject } from '@/api/people.service'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

import pinia from '@/stores'
import useOrganizationsStore from '@/stores/useOrganizations'

vi.mock('@/api/people.service.ts', () => ({
  searchPeopleProject: () => PeopleFactory.generateMany(8),
}))

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const factory = (props?) => {
  return lpiMount(MembersFilterEditor, {
    props: {
      ...props,
    },
    i18n,
  })
}

describe('MembersFilterEditor.vue', () => {
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.current = OrganizationOutputFactory.generate()
  })
  it('should render component', () => {
    const wrapper = factory({ modelValue: [] })
    expect(wrapper.exists()).toBe(true)
  })

  it('should display initial selection', async () => {
    const wrapper = factory({
      modelValue: [
        { id: 'aze', name: { fullname: 'random' } },
        { id: 'zer', name: { fullname: 'random' } },
        { id: 'ert', name: { fullname: 'random' } },
      ],
    })

    const vm: any = wrapper.vm
    await vm.$nextTick()
    const filterValues = wrapper.findAll('.filter-value.actionable')

    expect(filterValues.length).toBe(3)
  })

  it('should show search members', async () => {
    const wrapper = factory({
      modelValue: [],
    })
    const vm: any = wrapper.vm
    await vm.getPeople()
    await vm.$nextTick()
    const filterValues = wrapper.findAll('.filter-value.suggested')
    expect(filterValues.length).toBe(8)
  })

  it('should show emit input when selecting a person', async () => {
    const wrapper = factory({
      modelValue: [],
    })
    const vm: any = wrapper.vm
    await vm.getPeople()
    const filterValue = wrapper.find('.filter-value.suggested')
    filterValue.trigger('click')
    await vm.$nextTick()
    expect(wrapper.emitted('update:model-value')).toBeTruthy()
  })
})
