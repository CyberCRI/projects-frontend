import { lpiShallowMount } from '../../../../helpers/LpiMount'
import CommentItem from '@/components/project/comment/CommentItem.vue'
import english from '@/locales/en.json'
import { CommentFactory } from '../../../../factories/comment.factory'

import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
// localVue.filter('toLocaleDateString', (data) => data)

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

const store = {
    modules: {
        users: {
            namespaced: true,
            getters: {
                isSuperAdmin: vi.fn(() => true),
                user: vi.fn(() => true),
                isConnected: vi.fn(() => true),
                id: () => 123,
            },
        },
    },
}

describe('CommentItem', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        const usersStore = useUsersStore(pinia)
        usersStore.isSuperAdmin = true
        usersStore.user = {}
        usersStore.isConnected = true
        usersStore.id = 123
        defaultParams = {
            props: {
                comment: CommentFactory.generate(),
            },
            store,
            i18n,
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
