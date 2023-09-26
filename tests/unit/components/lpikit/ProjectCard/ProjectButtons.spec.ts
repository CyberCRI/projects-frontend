import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectButtons from '@/components/lpikit/ProjectCard/ProjectButtons.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('Buttons.vue', () => {
    it('should render component', () => {
        const wrapper = lpiMount(ProjectButtons, {
            propsData: {},
            i18n,
        })
        expect(wrapper.exists()).toBe(true)
    })
})
