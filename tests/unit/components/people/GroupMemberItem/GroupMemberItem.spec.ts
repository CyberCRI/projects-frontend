import { lpiMount } from '@/../tests/helpers/LpiMount'
import GroupMemberItem from '@/components/group/Modules/Members/GroupMemberItem.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import GroupMemberFactory from '@/../tests/factories/group-member.factory'

describe('GroupMemberItem.vue', () => {
  let wrapper
  let defaultParams

  beforeEach(() => {
    defaultParams = {
      props: {
        user: GroupMemberFactory.generate(),
      },
    }
  })
  it('should render GroupMemberItem component', () => {
    wrapper = lpiMount(GroupMemberItem, defaultParams)
    expect(wrapper.exists()).toBe(true)
  })
  it('should emit user-click event when clicking close', async () => {
    wrapper = lpiMount(GroupMemberItem, defaultParams)
    const closeButton = wrapper.find('.card-inner')

    expect(closeButton.exists()).toBeTruthy()

    await closeButton.element.dispatchEvent(new Event('click'))
    await closeButton.trigger('click')

    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
