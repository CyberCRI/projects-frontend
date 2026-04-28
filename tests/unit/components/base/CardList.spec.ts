import { ProjectFactory } from '~~/tests/factories/project.factory'
import CardList from '~/components/base/CardList.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'

import { describe, expect, it } from 'vitest'

describe('CardList.vue', () => {
  it('should initialize the component with the default values', () => {
    const wrapper = lpiMount(CardList, { props: { items: [] } })
    const vm: any = wrapper.vm
    expect(wrapper.exists()).toBeTruthy()
    expect(vm.items).toStrictEqual([])
    expect(vm.isLoading).toBe(false)
  })

  it('should show an empty box image and not show projects if there are no projects', () => {
    const wrapper = lpiMount(CardList, { props: { items: [] } })
    expect(wrapper.find('.card-list__empty').exists()).toBe(true)
    expect(wrapper.find('.card-container').exists()).toBe(false)
  })

  it('should not show an empty box image and show projects if there are projects', () => {
    const projects = ProjectFactory.generateMany(4)
    const wrapper = lpiMount(CardList, { props: { items: projects } })
    expect(wrapper.find('.card-list__empty').exists()).toBe(false)
    expect(wrapper.find('.card-container').exists()).toBe(true)
  })
})
