import { lpiShallowMount } from '../../../helpers/LpiMount'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import AppToastList from '@/components/app/AppToastList.vue'

import { describe, expect, it } from 'vitest'
import waitForExpect from 'wait-for-expect'
import { nextTick } from 'vue'
import useToasterStore from '@/stores/useToaster'

describe('AppToastList', () => {
    let wrapper
    let defaultParams

    it('should render AppToastList component', () => {
        wrapper = lpiShallowMount(AppToastList, defaultParams)

        expect(wrapper.exists()).toBeTruthy()
    })

    it('should auto close after a delay', async () => {
        wrapper = lpiShallowMount(AppToastList, defaultParams)
        const toaster = useToasterStore()
        toaster.toastList.push({
            isOpened: true,
            type: 'success',
            message: 'toast-message',
        })
        await nextTick()
        const snackbarComponent = wrapper.findComponent(LpiSnackbar)
        expect(snackbarComponent.exists()).toBeTruthy()
        waitForExpect(() => expect(toaster.deleteToast).toHaveBeenLastCalledWith(0))
    })
})
