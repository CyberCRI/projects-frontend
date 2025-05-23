import { lpiShallowMount } from '@/../tests/helpers/LpiMount'
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import { defineAsyncComponent } from 'vue'
import MockComponent from '@/../tests/helpers/MockComponent.vue'
import VueI18n from 'vue-i18n'
import english from '@/i18n/locales/en.json'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useAPI from '@/composables/useAPI'

// fix unhnadled rejection due to invalid url
vi.mock('@/composables/useAPI', () => {
  return {
    default: vi.fn().mockResolvedValue({ data: { results: [] } }), // TODO nuxt check this
  }
})
const mockRouter = {
  push: vi.fn(),
}

const mockRoute = {
  path: '/test1',
}

const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const factory = (props?) => {
  return lpiShallowMount(TabsLayout, {
    router: [
      { path: '/', component: MockComponent },
      { path: '/test1', component: MockComponent },
      { path: '/test2', component: MockComponent },
      { path: '/blank', component: MockComponent, name: 'blank' },
    ],
    props: {
      tabs: [
        {
          label: 'Tab 1',
          component: defineAsyncComponent(() => import('@/components/base/button/LpiButton.vue')),
          props: [{ label: 'LpiButton' }],
        },
        {
          label: 'Tab 2',
          component: defineAsyncComponent(() => import('@/components/base/LpiSnackbar.vue')),
          props: [{ text: 'success message', type: 'success' }],
        },
      ],
      ...props,
    },
    i18n,
    global: {
      mocks: {
        $router: mockRouter,
        $route: mockRoute,
      },
    },
  })
}

describe('TabsLayout.vue', () => {
  it('renders component', () => {
    const wrapper = factory()
    expect(wrapper.exists()).toBe(true)
  })

  it('changes current tab without routerView mode', () => {
    const wrapper = factory({ routerView: false })
    const vm: any = wrapper.vm

    expect(vm.current).toBe(0)
    vm.selectTab(1)
    expect(vm.current).toBe(1)
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('changes current tab with routerView mode', async () => {
    const tabs = [
      {
        key: 'tab-1',
        label: 'Tab 1',
        view: '/test1',
      },
      {
        key: 'tab-2',
        label: 'Tab 2',
        view: '/test2',
      },
    ]

    await mockRouter.push('/test1')

    const wrapper = factory({ routerView: true, tabs })
    const vm: any = wrapper.vm

    expect(vm.current).toBe(0)
    vm.selectTab(1)
    expect(vm.current).toBe(1)
    expect(mockRouter.push).toHaveBeenLastCalledWith('/test2')
  })
})
