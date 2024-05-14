import { lpiShallowMount } from '../../../helpers/LpiMount'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import AppToastList from '@/components/app/AppToastList/AppToastList.vue'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
describe('AppToastList', () => {
    let wrapper
    let defaultParams

    beforeEach(() => {
        defaultParams = {
            props: {
                toastList: [
                    {
                        isOpened: true,
                        type: 'success',
                        message: 'toast-message',
                    },
                ],
            },
        }
    })

    it('should render AppToastList component', () => {
        wrapper = lpiShallowMount(AppToastList, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should emit close event when clicking close', () => {
        wrapper = lpiShallowMount(AppToastList, defaultParams)
        const snackbarComponent = wrapper.findComponent(LpiSnackbar)
        snackbarComponent.vm.$emit('close', 0)

        expect(snackbarComponent.exists()).toBeTruthy()
        expect(wrapper.emitted('delete-toast', 0)).toBeTruthy()
    })
})
