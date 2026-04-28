import GroupDescriptionDrawer from '~/components/group/GroupForm/GroupDescriptionDrawer.vue'
import { lpiMount } from '~~/tests/helpers/LpiMount'
import { describe, expect, it } from 'vitest'

describe('GroupDescriptionDrawer.vue', () => {
  it('should render GroupDescriptionDrawer component', () => {
    const wrapper = lpiMount(GroupDescriptionDrawer)
    expect(wrapper.exists()).toBe(true)
  })
  it('should emit the close event', () => {
    const wrapper = lpiMount(GroupDescriptionDrawer)
    const vm: any = wrapper.vm

    vm.closeDrawer()
    expect(wrapper.emitted('close')).toBeTruthy()
  })
  it('should emit the update-description event', () => {
    const wrapper = lpiMount(GroupDescriptionDrawer)
    const vm: any = wrapper.vm

    vm.saveDescription()
    expect(wrapper.emitted('update-description')).toBeTruthy()
  })
})
