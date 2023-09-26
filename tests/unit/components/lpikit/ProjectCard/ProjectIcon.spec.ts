import { lpiMount } from '../../../../helpers/LpiMount'
import VueI18n from 'vue-i18n'
import english from '@/locales/en.json'
import ProjectIcon from '@/components/lpikit/ProjectCard/ProjectIcon.vue'
import { ProjectFactory } from '../../../../factories/project.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const project = ProjectFactory.generate()

const factory = (propsData?) => {
    return lpiMount(ProjectIcon, {
        props: {
            project,
            ...propsData,
        },
        i18n,
    })
}

describe('ProjectIcon.vue', () => {
    it('should render component', () => {
        const wrapper = factory({ project })
        expect(wrapper.exists()).toBe(true)
    })

    test('project icon running', () => {
        const wrapper = factory({ project })
        const vm: any = wrapper.vm

        expect(vm.projectIcon).toBe('Spinner')
    })

    test('project icon completed', () => {
        const wrapper = factory({ project: { ...project, life_status: 'completed' } })
        const vm: any = wrapper.vm

        expect(vm.projectIcon).toBe('Check')
    })

    test('project icon public', () => {
        const wrapper = factory({
            privacyIconVisible: true,
            project: { ...project, publication_status: 'public' },
        })
        const vm: any = wrapper.vm

        expect(vm.projectIcon).toBe('Eye')
    })

    test('project icon private', () => {
        const wrapper = factory({
            privacyIconVisible: true,
            project: { ...project, publication_status: 'private' },
        })
        const vm: any = wrapper.vm

        expect(vm.projectIcon).toBe('EyeSlash')
    })

    test('project icon community', () => {
        const wrapper = factory({
            privacyIconVisible: true,
            project: { ...project, publication_status: 'community' },
        })
        const vm: any = wrapper.vm

        expect(vm.projectIcon).toBe('Users')
    })
})
