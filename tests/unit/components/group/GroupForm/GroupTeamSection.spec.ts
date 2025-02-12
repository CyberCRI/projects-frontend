import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import GroupTeamSection from '@/components/group/GroupForm/GroupTeamSection.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('GroupTeamSection.vue', () => {
    let wrapper
    let defaultParams
    beforeEach(() => {
        const usersStore = useUsersStore(pinia)

        defaultParams = {
            i18n,
            props: {
                modelValue: [
                    {
                        id: 1,
                        profile_picture: { variations: {} },
                    },
                    {
                        id: 2,
                        profile_picture: { variations: {} },
                    },
                ],
            },
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
            expect(wrapper.emitted('update:model-value')).toBeTruthy()
        })
})
