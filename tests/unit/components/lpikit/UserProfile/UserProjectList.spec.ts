import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import UserProjectList from '@/components/lpikit/UserProfile/UserProjectList.vue'
import { describe, expect, it } from 'vitest'
import ProjectMemberFactory from '../../../../factories/project-member.factory'
import PeopleFactory from '../../../../factories/people.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const store = {
    modules: {
        organizations: {
            namespaced: true,
            state: {
                current: { code: 'FOOBAR' },
            },
        },
    },
}

describe('UserProjectList.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                user: PeopleFactory.generate(),
            },
            store,
        }
    })

    it('should render UserProjectList component', () => {
        wrapper = lpiMount(UserProjectList, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
