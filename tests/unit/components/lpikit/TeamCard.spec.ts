import { lpiShallowMount } from '../../../helpers/LpiMount'
import TeamCard from '@/components/lpikit/TeamCard/TeamCard.vue'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

function buildStore() {
    return {
        modules: {
            users: {
                namespaced: true,
                getters: {
                    user: () => {
                        return { id: 1 }
                    },
                },
            },
        },
    }
}

describe('TeamCard', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                user: {
                    people_id: '720deaa8-5f28-4411-a8f6-f8ecf8e0a101',
                    family_name: 'Yes',
                    given_name: 'No',
                    title: 'Maybe',
                },

                bigCard: true,
            },
            i18n,
            store: buildStore(),
        }
    })

    it('should render TeamCard component', () => {
        wrapper = lpiShallowMount(TeamCard, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should trigger the full profile button', () => {
        wrapper = lpiShallowMount(TeamCard, defaultParams)

        const button = wrapper.find('.btn')
        button.trigger('click')

        expect(button.exists()).toBeTruthy()
        expect(wrapper.emitted('full-profile')).toBeTruthy()
    })
})
