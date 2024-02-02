import { lpiShallowMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProfileHeader from '@/components/lpikit/FullProfile/ProfileHeader.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { OrganizationOutputFactory } from '../../../../factories/organization.factory'
import { UserFactory } from '../../../../factories/user.factory'

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
            getters: {
                current: () => OrganizationOutputFactory.generate(),
            },
        },
    },
}

describe('ProfileHeader', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                user: UserFactory.generate(),
            },
            i18n,
            store,
        }
    })

    it('should render ProfileHeader component', () => {
        wrapper = lpiShallowMount(ProfileHeader, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
