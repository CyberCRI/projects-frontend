// import router from '@/router'
import analytics from '@/analytics'
import waitForExpect from 'wait-for-expect'
import pinia from '@/stores'
import useUsersStore from '@/stores/useUsers'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'

vi.mock('@/analytics')

vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

vi.mock('@/router/routes', () => ({
  default: [
    // not used anymore, maybe later ? see routes.ts
    // {
    //     path: '/discover',
    //     name: 'Discover',
    //     component: {},
    // },
    {
      path: '/dashboard',
      name: 'Home',
      component: {},
    },
    {
      path: '/restricted',
      name: 'restricted',
      component: {},
      meta: { requiresAuth: true },
    },
  ],
}))

vi.unmock('@/router/index')

analytics.page.viewed = vi.fn(() => {})

describe.skip('Router redirections on routes requiring auth', () => {
  beforeEach(() => {
    const usersStore = useUsersStore(pinia)
  })

  it('should redirect user with organization trying to access auth-required route to /dashboard', async () => {
    const router = useRouter()
    router.push('/restricted').catch(() => {})

    await waitForExpect(() => {
      expect(router.currentRoute.value.path).toEqual('/dashboard')
    })
  })

  // not used anymore, maybe later ? see routes.ts
  // it('should redirect user without organization trying to access auth-required route to /discover', async () => {
  //     // Temporary save env's api-base-org-id
  //     const initialApiBaseOrgId = process.env.NUXT_PUBLIC_APP_API_ORG_CODE
  //     // Mock user with no organization
  //     process.env.NUXT_PUBLIC_APP_API_ORG_CODE = ''

  //     router.push('/restricted').catch(() => {})

  //     await waitForExpect(() => {
  //         expect(router.currentRoute.value.path).toEqual('/discover')
  //     })

  //     // Reset env's api-base-org-id for next tests
  //     process.env.NUXT_PUBLIC_APP_API_ORG_CODE = initialApiBaseOrgId
  // })
})
