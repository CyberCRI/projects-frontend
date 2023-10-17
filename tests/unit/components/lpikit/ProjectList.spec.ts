import { lpiMount } from '../../../helpers/LpiMount'
import CardList from '@/components/lpikit/ProjectList/CardList.vue'
import { ProjectFactory } from '../../../factories/project.factory'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const projects = ProjectFactory.generateMany(4)

const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

const factory = (props?) => {
    return lpiMount(CardList, {
        props,
        i18n,
    })
}

describe('CardList.vue', () => {
    it('should initialize the component with the default values', () => {
        const wrapper = factory({ projects: [] })
        const vm: any = wrapper.vm
        expect(wrapper.exists()).toBeTruthy()
        expect(vm.projects).toStrictEqual([])
        expect(vm.isLoading).toBe(false)
    })

    it('should show an empty box image and not show projects if there are no projects', () => {
        const wrapper = factory({ projects: [] })
        expect(wrapper.find('.card-list__empty').exists()).toBe(true)
        expect(wrapper.find('.card-list__content').exists()).toBe(false)
    })

    it('should not show an empty box image and show projects if there are projects', () => {
        const wrapper = factory({ projects: projects })
        expect(wrapper.find('.card-list__empty').exists()).toBe(false)
        expect(wrapper.find('.card-list__content').exists()).toBe(true)
    })
})
