import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import CommentItem from '@/components/project/comment/CommentItem.vue'
import { CommentFactory } from '@/../tests/factories/comment.factory'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useOrganizationsStore from '@/stores/useOrganizations'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// issue with webcrypto, so mock so offending import
vi.mock('y-prosemirror', () => ({ default: {} }))

describe('CommentItem', () => {
  let wrapper
  let defaultParams
  let usersStore
  beforeEach(() => {
    const organizationsStore = useOrganizationsStore(pinia)
    organizationsStore.$patch({
      current: { id: 123 },
    } as any)

    usersStore = useUsersStore(pinia)
    usersStore.$patch({
      user: { id: 123 },
      userFromApi: { id: 123 },
      userFromToken: { id: 123 },
    } as any)
    defaultParams = {
      props: {
        comment: { ...CommentFactory.generate(), author: { id: 123 } },
      },
    }
  })

  it('should render CommentItem component', () => {
    wrapper = lpiShallowMount(CommentItem, defaultParams)
    const vm: any = wrapper.vm

    expect(wrapper.exists()).toBeTruthy()
    expect(vm.canEdit).toBe(true)
    expect(vm.currentUserId).toBe(123)
    expect(vm.isConnected).toBe(true)
  })
})
