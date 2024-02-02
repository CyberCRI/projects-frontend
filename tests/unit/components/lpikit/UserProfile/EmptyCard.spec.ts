import { lpiMount, lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import EmptyCard from '@/components/lpikit/UserProfile/EmptyCard.vue'
import { describe, expect, it } from 'vitest'
import ProjectMemberFactory from '../../../../factories/project-member.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}
const members = ProjectMemberFactory.generateMany(2)

describe('EmptyCard.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                label: 'test',
            },
        }
    })

    it('should render EmptyCard component', () => {
        wrapper = lpiMount(EmptyCard, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
