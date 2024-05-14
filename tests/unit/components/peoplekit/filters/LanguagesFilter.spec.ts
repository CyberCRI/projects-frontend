import { lpiMount } from '../../../../helpers/LpiMount'
import LanguageFilter from '@/components/lpikit/Filters/LanguageFilter.vue'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
function buildStore() {
    return {
        modules: {
            languages: {
                namespaced: true,
                getters: {
                    all: () => ['en', 'fr'],
                },
            },
        },
    }
}

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const factory = (props?) => {
    return lpiMount(LanguageFilter, {
        props: {
            ...props,
        },
        store: buildStore(),
        i18n,
    })
}

describe('LanguageFilter.vue', () => {
    it('should render component', () => {
        const wrapper = factory({ modelValue: [] })
        expect(wrapper.exists()).toBe(true)
    })

    it('should display english and french buttons', () => {
        const wrapper = factory({ modelValue: [] })
        const buttonContainers = wrapper.findAll('.checkbox')

        expect(buttonContainers.length).toBe(2)
    })

    it('should emit event update is triggered', async () => {
        const wrapper = factory({ modelValue: [] })
        const buttonContainer = wrapper.find('[type=checkbox]')
        ;(buttonContainer as any).setChecked()
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
})
