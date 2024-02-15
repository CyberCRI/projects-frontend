import { lpiMount, lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import UserItem from '@/components/lpikit/GroupMemberSection/UserItem.vue'
import { describe, expect, it } from 'vitest'
import GroupMemberFactory from '../../../../factories/group-member.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('UserItem.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                user: GroupMemberFactory.generate(),
            },
        }
    })

    it('should render UserItem component', () => {
        wrapper = lpiMount(UserItem, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit user-click event when clicking close', async () => {
            wrapper = lpiShallowMount(UserItem, defaultParams)
            const closeButton = wrapper.find('.user')

            expect(closeButton.exists()).toBeTruthy()

            closeButton.trigger('click')
            await wrapper.vm.$nextTick()
            expect(wrapper.emitted('user-click')).toBeTruthy()
        })
})
