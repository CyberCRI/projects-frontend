import { lpiShallowMount } from '../../../../helpers/LpiMount'
import CommentItem from '@/components/lpikit/ProjectComments/CommentItem.vue'
import english from '@/locales/en.json'
import { CommentFactory } from '../../../../factories/comment.factory'

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
            },
            state: {
                keycloak_id: '123',
            },
        },
    },
}

describe('CommentItem', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
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
        expect(vm.currentUserId).toBe('123')
        expect(vm.isConnected).toBe(true)
    })
})
