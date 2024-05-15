import { lpiMount } from '../../../helpers/LpiMount'
import NoItem from '@/components/project/NoItem/NoItem.vue'
import english from '@/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

// Mount function
const factory = (props?) => {
    return lpiMount(NoItem, {
        props: {
            ...props,
        },
        i18n,
    })
}

describe('NoItem.vue', () => {
    it('should render and initialize the component with the default value', () => {
        const wrapper = factory()
        const vm: any = wrapper.vm

        expect(wrapper.exists()).toBe(true)
        expect(vm.message).toBe('')
    })

    it('should apply the settings passed by props', () => {
        const wrapper = factory({
            message: 'blog.no-entry',
        })
        const vm: any = wrapper.vm

        expect(vm.message).toBe('blog.no-entry')
        expect(wrapper.find('.message').text()).toBe('No entry yet ...')
    })
})
