import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import SocialNetworks from '@/components/people/FullProfile/SocialNetworks.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { UserFactory } from '@/../tests/factories/user.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('SocialNetworks', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                user: UserFactory.generate(),
            },
            i18n,
        }
    })

    it('should render SocialNetworks component', () => {
        wrapper = lpiShallowMount(SocialNetworks, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
