import { lpiShallowMount } from '../../../helpers/LpiMount'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import { ProjectOutputFactory } from '../../../factories/project.factory'
import { loadLocaleMessages } from '@/locales/i18n'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: loadLocaleMessages(),
}

describe('ProjectCard', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                project: ProjectOutputFactory.generate(),
            },
        }
    })

    it('should render ProjectCard component', () => {
        wrapper = lpiShallowMount(ProjectCard, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })
})
