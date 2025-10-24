import { lpiShallowMount, lpiMount } from '@/../tests/helpers/LpiMount'
import LpiSnackbar from '@/components/base/LpiSnackbar.vue'
import AppToastList from '@/components/app/AppToastList.vue'

import { describe, expect, it } from 'vitest'
import waitForExpect from 'wait-for-expect'
import { nextTick } from 'vue'
import useToasterStore from '@/stores/useToaster'
import english from '@/i18n/locales/en.json'

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

describe('AppToastList', () => {
  let wrapper
  let defaultParams = { i18n }

  it('should render AppToastList component', () => {
    wrapper = lpiShallowMount(AppToastList, defaultParams)

    expect(wrapper.exists()).toBeTruthy()
  })

  it('should auto close after a delay', async () => {
    wrapper = lpiMount(AppToastList, defaultParams)
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
