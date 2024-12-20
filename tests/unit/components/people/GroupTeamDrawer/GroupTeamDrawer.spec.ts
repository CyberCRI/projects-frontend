import { lpiMount, lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import GroupTeamDrawer from '@/components/people/GroupTeamDrawer/GroupTeamDrawer.vue'
import { describe, expect, it } from 'vitest'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}
const members = [
    {
        id: 1,
        profile_picture: { variations: {} },
    },
    {
        id: 2,
        profile_picture: { variations: {} },
    },
]

describe('GroupTeamDrawer.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                currentUsers: members,
                isOpened: true,
                mode: 'select',
            },
        }
    })

    it('should render GroupTeamDrawer component', () => {
        wrapper = lpiMount(GroupTeamDrawer, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit add-user and close events', async () => {
            wrapper = lpiShallowMount(GroupTeamDrawer, defaultParams)
            wrapper.vm.addTeamMember()
            expect(wrapper.emitted('add-user')).toBeTruthy()
            expect(wrapper.emitted('close')).toBeTruthy()
        }),
        it('should emit set-mode events', async () => {
            wrapper = lpiShallowMount(GroupTeamDrawer, defaultParams)
            wrapper.vm.goBackToUserSelection()
            expect(wrapper.emitted('set-mode')).toBeTruthy()
        })
})
