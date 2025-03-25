import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import CommentItem from '@/components/project/comment/CommentItem.vue'
import english from '@/locales/en.json'
import { CommentFactory } from '@/../tests/factories/comment.factory'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import useOrganizationsStore from '@/stores/useOrganizations'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

// issue with webcrypto, so mock so offending import
import { yUndoPluginKey } from 'y-prosemirror'
vi.mock('y-prosemirror', () => ({ default: {} }))

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

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
      i18n,
    }
  })
  afterEach(() => {
    usersStore.$reset()
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
