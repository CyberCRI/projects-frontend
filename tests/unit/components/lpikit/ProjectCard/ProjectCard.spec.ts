import { lpiMount } from '../../../../helpers/LpiMount'
import english from '@/locales/en.json'
import ProjectCard from '@/components/lpikit/ProjectCard/ProjectCard.vue'
import { ProjectFactory } from '../../../../factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const factory = () => {
    return lpiMount(ProjectCard, {
        props: {
            project: ProjectFactory.generate(),
        },
        i18n,
    })
}

describe('ProjectCard.vue', () => {
    it('should render component', () => {
        const wrapper = factory()
        expect(wrapper.exists()).toBe(true)
    })

    it('toggles preview mode', () => {
        const wrapper = factory()
        const vm: any = wrapper.vm

        expect(vm.previewMode).toBe(false)
        vm.togglePreviewMode()
        expect(vm.previewMode).toBe(true)
    })
})
