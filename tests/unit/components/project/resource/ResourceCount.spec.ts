import { lpiMount } from '@/../tests/helpers/LpiMount'
import english from '@/i18n/locales/en.json'
import ResourceCount from '@/components/project/resource/ResourceCount.vue'
import MockComponent from '@/../tests/helpers/MockComponent.vue'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
const i18n = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
  },
}

const mockRouter = {
  push: vi.fn(),
}

const mockRoute = {
  path: '/test1',
}

describe('ResourceCount.vue', () => {
  it('should render component', () => {
    const wrapper = lpiMount(ResourceCount, {
      props: {
        count: 2,
        target: 'foo',
      },
      i18n,
      router: [{ path: '/:pathMatch(.*)', component: MockComponent }],
      global: {
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })
})
