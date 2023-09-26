import { lpiMount } from '../../../helpers/LpiMount'
import english from '@/locales/en.json'
import CommentModal from '@/components/lpikit/CommentModal/CommentModal.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
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

const factory = (propsData?) => {
    return lpiMount(CommentModal, {
        i18n,
        props: {
            ...propsData,
        },
        stubs: {
            TipTapEditor: true,
            teleport: true,
        },
    })
}

describe('CommentModal.vue', () => {
    it('should render component', () => {
        const wrapper = factory()
        expect(wrapper.exists()).toBe(true)
    })

    it('should display the comment to witch it replies', () => {
        const wrapper = factory({
            repliedComment: {
                content: '<p>The content of the replied comment</p>',
                created_at: '2022-09-15T15:03:00',
                author: {
                    given_name: 'John',
                    family_name: 'Doe',
                    people_id: '123',
                },
            },
        })
        expect(wrapper.find('.source').exists()).toBeTruthy()
        expect(wrapper.text()).toContain('The content of the replied comment')
    })

    it('should not display delete button in the comment is created', () => {
        const wrapper = factory()
        expect(wrapper.find('.button-footer--delete').exists()).toBeFalsy()
    })

    it('should display delete button in the comment is edited', () => {
        const wrapper = factory({
            originalComment: {
                content: '<p>This is the original comment content</p>',
            },
        })
        expect(wrapper.find('.button-footer--delete').exists()).toBeTruthy()
    })
})
