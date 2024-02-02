import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import GroupTeamSection from '@/components/lpikit/GroupForm/GroupTeamSection.vue'
import { describe, expect, it } from 'vitest'
import { ProjectFactory } from '../../../../factories/project.factory'

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
                userFromApi: vi.fn().mockReturnValue({}),
            },
        },
    },
}

describe('GroupTeamSection.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                modelValue: ProjectFactory.generateMany(2),
            },
            store,
        }
    })

    it('should render GroupTeamSection component', () => {
        wrapper = lpiMount(GroupTeamSection, defaultParams)
        expect(wrapper.exists()).toBe(true)
    }),
        it('should emit the update-team event', () => {
            wrapper = lpiMount(GroupTeamSection, defaultParams)
            const vm: any = wrapper.vm

            vm.addUsers([])
            expect(wrapper.emitted('update-team')).toBeTruthy()
        })
})
