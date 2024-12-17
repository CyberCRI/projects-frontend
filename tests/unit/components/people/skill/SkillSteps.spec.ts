import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import SkillSteps from '@/components/people/skill/SkillSteps.vue'

import { loadLocaleMessages } from '@/locales/i18n'
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

describe('SkillSteps', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                steps: 3,
                activeStep: 1,
                hasBorder: false,
            },
        }
    })

    it('should render SkillSteps component', () => {
        wrapper = lpiShallowMount(SkillSteps, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should find the border selector when set to TRUE', () => {
        defaultParams.props.hasBorder = true
        wrapper = lpiShallowMount(SkillSteps, defaultParams)

        const border = wrapper.find('.border')

        expect(border.exists()).toBeTruthy()
    })

    it('should find all the steps by selector', () => {
        wrapper = lpiShallowMount(SkillSteps, defaultParams)

        const steps = wrapper.findAll('.step')

        expect(steps.length).toBe(3)
    })

    it('should find a completed step', () => {
        wrapper = lpiShallowMount(SkillSteps, defaultParams)

        const selectedStep = wrapper.find('.step-completed')

        expect(selectedStep.exists()).toBeTruthy()
    })
})
