import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectSection from '@/components/group/GroupForm/ProjectSection.vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { ProjectFactory } from '@/../tests/factories/project.factory'

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const projects = ProjectFactory.generateMany(2).map((project) => ({ ...project }))

describe('ProjectSection.vue', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            i18n,
            props: {
                modelValue: projects,
            },
        }
    })

    it('should render ProjectSection component', () => {
        wrapper = lpiMount(ProjectSection, defaultParams)
        expect(wrapper.exists()).toBe(true)
    })
})
