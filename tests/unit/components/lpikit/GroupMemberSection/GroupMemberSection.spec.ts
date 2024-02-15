import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import GroupMemberSection from '@/components/lpikit/GroupMemberSection/GroupMemberSection.vue'
import { describe, expect, it } from 'vitest'
import { GroupMemberFactory } from '../../../../factories/group-member.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('GroupMemberSection.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                members: GroupMemberFactory.generateMany(3),
            },
        }
    })

    it('should render GroupMemberSection component', () => {
        wrapper = lpiMount(GroupMemberSection, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
