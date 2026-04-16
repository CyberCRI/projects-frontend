import { lpiMount } from '@/../tests/helpers/LpiMount'
import ResourceCount from '@/components/project/resource/ResourceCount.vue'
import MockComponent from '@/../tests/helpers/MockComponent.vue'

import { describe, expect, it, vi } from 'vitest'

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
