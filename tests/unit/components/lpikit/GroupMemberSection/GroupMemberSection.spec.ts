import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import GroupMemberSection from '@/components/lpikit/GroupMemberSection/GroupMemberSection.vue'
import { describe, expect, it } from 'vitest'
import { ProjectTeamOutputFactory } from '../../../../factories/project-member.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}
const team = ProjectTeamOutputFactory.generate()

describe('GroupMemberSection.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                members: [
                    ...team.owners,
                    ...team.reviewers,
                    ...team.members,
                    ...team.people_groups,
                ],
            },
        }
    })

    it('should render GroupMemberSection component', () => {
        wrapper = lpiMount(GroupMemberSection, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
