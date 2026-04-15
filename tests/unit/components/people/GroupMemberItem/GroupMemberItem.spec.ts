import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupMemberItem from '@/components/group/Modules/Members/GroupMemberItem.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import GroupMemberFactory from '@/../tests/factories/group-member.factory'

describe('GroupMemberItem.vue', () => {
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        member: GroupMemberFactory.generate(),
      },
    }
  })
  it('should render GroupMemberItem component', () => {
    const wrapper = lpiMount(GroupMemberItem, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
  it('should emit user-click event when clicking close', async () => {
    const wrapper = lpiMount(GroupMemberItem, defaultParams)
    const closeButton = wrapper.find('.card-inner')

    expect(closeButton.exists()).toBeTruthy()

    await closeButton.element.dispatchEvent(new Event('click'))
    await closeButton.trigger('click')

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
