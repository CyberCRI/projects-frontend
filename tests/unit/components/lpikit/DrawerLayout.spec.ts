import english from '@/locales/en.json'
import { lpiShallowMount, lpiMount } from '../../../helpers/LpiMount'
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
const i18n = {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: english,
    },
}

describe('DrawerLayout', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                isOpened: true,
                title: 'Rechercher',
                confirmActionName: 'Rechercher',
            },
            i18n,
        }
    })

    it('should render DrawerLayout component', () => {
        wrapper = lpiShallowMount(DrawerLayout, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should show DrawerLayout component when it is opened', () => {
        wrapper = lpiShallowMount(DrawerLayout, defaultParams)
        const drawerIsShown = wrapper.find('.drawer')

        expect(drawerIsShown.exists()).toBeTruthy()
    })

    it('should hide DrawerLayout component when it is closed', () => {
        defaultParams.props.isOpened = false
        wrapper = lpiShallowMount(DrawerLayout, defaultParams)
        const drawerIsShown = wrapper.find('.drawer--opened')

        expect(drawerIsShown.exists()).toBeFalsy()
    })

    it('should emit close event when clicking close', async () => {
        wrapper = lpiShallowMount(DrawerLayout, defaultParams)
        const closeButton = wrapper.find('.header__close')

        expect(closeButton.exists()).toBeTruthy()

        closeButton.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit close event when clicking outside', async () => {
        wrapper = lpiShallowMount(DrawerLayout, defaultParams)
        const outside = wrapper.find('.background')

        expect(outside.exists()).toBeTruthy()

        outside.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit close event when clicking cancel', async () => {
        wrapper = lpiMount(DrawerLayout, defaultParams)
        const cancel = wrapper.find('.footer__left-button')

        expect(cancel.exists()).toBeTruthy()

        cancel.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted('close')).toBeTruthy()
    })

    it('should emit confirm event when clicking confirm', async () => {
        wrapper = lpiMount(DrawerLayout, defaultParams)
        const cancel = wrapper.find('.footer__right-button')

        expect(cancel.exists()).toBeTruthy()

        cancel.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted('confirm')).toBeTruthy()
    })
})
