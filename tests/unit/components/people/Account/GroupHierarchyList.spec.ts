import GroupHierarchyList from '@/components/people/Account/GroupHierarchyList.vue'
import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { UserFactory } from '../../../../factories/user.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('GroupHierarchyList', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                isAddMode: true,
                selectedUser: UserFactory.generate(),
            },
            i18n,
        }
    })

    it('should render GroupHierarchyList component', () => {
        wrapper = lpiShallowMount(GroupHierarchyList, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
