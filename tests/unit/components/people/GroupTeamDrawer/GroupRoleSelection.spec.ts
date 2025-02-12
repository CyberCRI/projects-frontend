import { lpiMount, lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import GroupRoleSelection from '@/components/people/GroupTeamDrawer/GroupRoleSelection.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import ProjectMemberFactory from '@/../tests/factories/project-member.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}
const members = ProjectMemberFactory.generateMany(2)

describe('GroupRoleSelection.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                selectedUsers: members,
            },
        }
    })

    it('should render GroupRoleSelection component', () => {
        wrapper = lpiMount(GroupRoleSelection, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit select-role event when clicking close', async () => {
            wrapper = lpiShallowMount(GroupRoleSelection, defaultParams)
            wrapper.vm.selectRole(members[0], 'owner')
            expect(wrapper.emitted('select-role', members)).toBeTruthy()
        })
})
