import * as auth from '@/api/auth/auth.service'
import { removeApiCookie } from '@/api/auth/cookie.service'
import analytics from '@/analytics'
import funct from '@/functs/functions'
import * as keycloakUtils from '@/api/auth/keycloakUtils'
import { setActivePinia, createPinia } from 'pinia'
import useUsersStore from '@/stores/useUsers'
import waitForExpect from 'wait-for-expect'

import flushPromises from 'flush-promises'

import cloneDeep from 'lodash.clonedeep'

// export default function resetStore({ store }) {
//   const initialState = cloneDeep(store.$state)
//   store.$reset = () => store.$patch(cloneDeep(initialState))
// }
// pinia.use(resetStore)

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
// vi.mock('@/router/index', () => ({
//   default: {
//     push: vi.fn(),
//   },
// }))

vi.mock('@/api/people.service')
vi.mock('@/api/auth/auth.service')
vi.mock('@/analytics')
vi.mock('@/functs/functions')

describe('Store module | users | init', () => {
  let pinia
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
  })
  afterEach(() => {
    // usersStore.$reset()
  })
  const access_token =
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4dEVDUnNWai1HT3EzcXY3bVVJTDdfQUNjQ2JHZ3NwQ2FsaE55WndKbzM4In0.eyJleHAiOjE2NDYzNTM5NDUsImlhdCI6MTY0NjMxNzk0OCwiYXV0aF90aW1lIjoxNjQ2MzE3OTQ1LCJqdGkiOiI5ZTdiNmJkYS1hNzY4LTQ3MTAtOGE1NS1lMDA5ZDU0NjA2NDciLCJpc3MiOiJodHRwczovL2lkLmxlYXJuaW5nLXBsYW5ldC5vcmcvYXV0aC9yZWFsbXMvbHAiLCJzdWIiOiI0MDA1ZGRmNy0xNzIxLTQ0MGUtYWYyYS00ZGFmZTFmNDI4YzAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwcm9qZWN0cy1mcm9udGVuZC1kZXYiLCJzZXNzaW9uX3N0YXRlIjoiZWQxZDQyMDctZTY2MC00MGNiLWExMzUtYWZkNjdjMjYzMWNkIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3Byb2ZpbGUucHJvamVjdHMuZGV2LmxwLWkuZGV2IiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiaHR0cDovLzEyNy4wLjAuMTo4MDgwIiwiaHR0cHM6Ly9wcm9qZWN0cy5kZXYuY3JpLXBhcmlzLm9yZyIsImh0dHBzOi8vMTI3LjAuMC4xOjgwODAiLCJodHRwczovL2xvY2FsaG9zdDo4MDgwIl0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiJlZDFkNDIwNy1lNjYwLTQwY2ItYTEzNS1hZmQ2N2MyNjMxY2QiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6Imp1bGllbiBkcm91bGV6IiwiZ3JvdXBzIjpbIi9wcm9qZWN0cy9hZG1pbmlzdHJhdG9ycyJdLCJwaWQiOiI1YTc5MGYxZS0wNGFlLTQ0ZTktOTkxOC03YWE2YjQ3ZTllNTQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqdWxpZW4uZHJvdWxlekBjcmktcGFyaXMub3JnIiwiZ2l2ZW5fbmFtZSI6Imp1bGllbiIsImZhbWlseV9uYW1lIjoiZHJvdWxleiIsInVzZXIiOnsiaWQiOiI1YTc5MGYxZS0wNGFlLTQ0ZTktOTkxOC03YWE2YjQ3ZTllNTQifSwiZW1haWwiOiJqdWxpZW4uZHJvdWxlekBmcmVlLmZyIn0.MQivUAcfBX-SpXvT6dAXKOOouv169ukjJcXdsFDk_XaAROvHjkoEKIaG0xMcKLDVlS6sYl4Wfdm0YV0Xpe3cCaU-OZDCES7A_Zw9icGsYIYNJLAz-ncVF09Ao3AfA_4OuSQv9lpByOh-F4TekVlVWdTbrdFcn1Y4p6UTl6w6yhcXWeFOd9db2_M0vjc9s8fffpTZIWZM-CkQBvW9wO0bQd1wBKXFfARHHsXQ6B1FNE67UWHztEJepvPdXNC0CLdzFGg-K7hDeNMrCm75ymosy44N3u_DZq1qEjnt0Ext5VJyE4RbITOdN4mxM3CAZFTeNzNb56GgkyHEgLpovWastw'
  const refresh_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0NWUwOTFkNi00YzQxLTQwZWItYTI3ZC1kOGM2ODQ4OGM3YjEifQ.eyJleHAiOjE2NDYzMTk3NDgsImlhdCI6MTY0NjMxNzk0OCwianRpIjoiYWRhYTBkMmQtZTZkYS00MTdmLWI3NmEtODI4M2RhODIzNGM2IiwiaXNzIjoiaHR0cHM6Ly9pZC5sZWFybmluZy1wbGFuZXQub3JnL2F1dGgvcmVhbG1zL2xwIiwiYXVkIjoiaHR0cHM6Ly9pZC5sZWFybmluZy1wbGFuZXQub3JnL2F1dGgvcmVhbG1zL2xwIiwic3ViIjoiNDAwNWRkZjctMTcyMS00NDBlLWFmMmEtNGRhZmUxZjQyOGMwIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InByb2plY3RzLWZyb250ZW5kLWRldiIsInNlc3Npb25fc3RhdGUiOiJlZDFkNDIwNy1lNjYwLTQwY2ItYTEzNS1hZmQ2N2MyNjMxY2QiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic2lkIjoiZWQxZDQyMDctZTY2MC00MGNiLWExMzUtYWZkNjdjMjYzMWNkIn0.-etAqxw8b0Q3VxF2SjyT-nCHMXSGcwtq70RqtbdF_84'
  const id_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0NWUwOTFkNi00YzQxLTQwZWItYTI3ZC1kOGM2ODQ4OGM3YjEifQ.eyJleHAiOjE2NDYzMTk3NDgsImlhdCI6MTY0NjMxNzk0OCwianRpIjoiYWRhYTBkMmQtZTZkYS00MTdmLWI3NmEtODI4M2RhODIzNGM2IiwiaXNzIjoiaHR0cHM6Ly9pZC5sZWFybmluZy1wbGFuZXQub3JnL2F1dGgvcmVhbG1zL2xwIiwiYXVkIjoiaHR0cHM6Ly9pZC5sZWFybmluZy1wbGFuZXQub3JnL2F1dGgvcmVhbG1zL2xwIiwic3ViIjoiNDAwNWRkZjctMTcyMS00NDBlLWFmMmEtNGRhZmUxZjQyOGMwIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InByb2plY3RzLWZyb250ZW5kLWRldiIsInNlc3Npb25fc3RhdGUiOiJlZDFkNDIwNy1lNjYwLTQwY2ItYTEzNS1hZmQ2N2MyNjMxY2QiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic2lkIjoiZWQxZDQyMDctZTY2MC00MGNiLWExMzUtYWZkNjdjMjYzMWNkIn0.-etAqxw8b0Q3VxF2SjyT-nCHMXSGcwtq70RqtbdF_84'
  function setTokens() {
    localStorage.setItem('ACCESS_TOKEN', access_token)
    localStorage.setItem('REFRESH_TOKEN', refresh_token)

    localStorage.setItem('ID_TOKEN', id_token)

    localStorage.setItem('REFRESH_TOKEN_EXP', '10000')
  }

  function unsetTokens() {
    localStorage.removeItem('ACCESS_TOKEN')
    localStorage.removeItem('REFRESH_TOKEN')
    localStorage.removeItem('ID_TOKEN')
    localStorage.removeItem('REFRESH_TOKEN_EXP')
  }

  it('should not set token with expired token', () => {
    const oldAccessToken = localStorage.getItem('ACCESS_TOKEN')
    const olRefreshToken = localStorage.getItem('REFRESH_TOKEN')
    setTokens()
    // usersStore.$reset()
    //usersStore = useUsersStore(pinia)
    let usersStore = useUsersStore(pinia)
    expect(usersStore.accessToken).toBe(null)
    localStorage.setItem('ACCESS_TOKEN', oldAccessToken)
    localStorage.setItem('REFRESH_TOKEN', olRefreshToken)
  })

  it('should set access with valid token', () => {
    const checkExpiredTokenSpy = vi.spyOn(keycloakUtils, 'checkExpiredToken')
    checkExpiredTokenSpy.mockImplementationOnce(() => false)
    const oldAccessToken = localStorage.getItem('ACCESS_TOKEN')
    const olRefreshToken = localStorage.getItem('REFRESH_TOKEN')
    setTokens()
    // usersStore.$reset()
    // usersStore = useUsersStore(pinia)
    let usersStore = useUsersStore(pinia)
    expect(usersStore.accessToken).toBe(access_token)
    localStorage.setItem('ACCESS_TOKEN', oldAccessToken)
    localStorage.setItem('REFRESH_TOKEN', olRefreshToken)
  })

  it('should not set access token with no token', () => {
    const oldAccessToken = window.localStorage.getItem('ACCESS_TOKEN')
    const olRefreshToken = window.localStorage.getItem('REFRESH_TOKEN')
    unsetTokens()
    // usersStore.$reset()
    let usersStore = useUsersStore(pinia)
    expect(usersStore.accessToken).toBe(null)
    window.localStorage.setItem('ACCESS_TOKEN', oldAccessToken)
    window.localStorage.setItem('REFRESH_TOKEN', olRefreshToken)
  })
})

describe('Store module | users | getters', () => {
  let pinia
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
  })
  afterEach(() => {
    // usersStore.$reset()
  })
  const stateWithSessionToken = {
    refreshToken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJydCI6eyJwaWQiOiI2YTViMWM0MC02NzQwLTQ2NjUtYTdmNS05NWI2ZDcwY2ZkNWYifSwiZXhwIjoxNjMzNzY0NjU3fQ.iIG2cjz5Tn4kq1_qiIfiCi-SoR8ZREUKoQBBgfd4c9AMhl2V4SDY47GmAImHc5XUu3hq2k0hoWGvlrBON3DwZQ',
    accessToken:
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzd3AxSnNmcHlYNUNNRXJSWE1LUy1kTHJQbHlwNGtBc3lVNnZYYlM5emZnIn0.eyJleHAiOjE2MzQxMjA5MjQsImlhdCI6MTYzNDEyMDYyNCwiYXV0aF90aW1lIjoxNjM0MTIwNjIyLCJqdGkiOiJhNTZjYjdiMy01NGRlLTQ5MjUtYjI4NS1mOGVlYjNhZDIxMjEiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLms4cy5kZXYuYXp1cmUuY3JpLXBhcmlzLnRlY2gvYXV0aC9yZWFsbXMvTGVhcm5pbmdQbGFuZXQiLCJhdWQiOlsicmVhbG0tbWFuYWdlbWVudCIsImFjY291bnQiXSwic3ViIjoiZThmMWM3ZTEtMDE4NS00NGY0LTkyOTUtYTY3MmU0MWFkZjE2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicHJvamVjdHMtcGtjZSIsInNlc3Npb25fc3RhdGUiOiJhMGJiMzA4ZS0wMmEyLTQ5YjUtYWJhMy02NmJhM2I2NTY2NjIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwiZGVmYXVsdC1yb2xlcy1sZWFybmluZ3BsYW5ldCIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LXJlYWxtIiwiY3JlYXRlLWNsaWVudCIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktY2xpZW50cyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6ImEwYmIzMDhlLTAyYTItNDliNS1hYmEzLTY2YmEzYjY1NjY2MiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiQ29saW4gRmFpdnJlIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiY29saW4uZmFpdnJlQGdtYWlsLmNvbSIsImxvY2FsZSI6ImZyIiwiZ2l2ZW5fbmFtZSI6IkNvbGluIiwiZmFtaWx5X25hbWUiOiJGYWl2cmUiLCJlbWFpbCI6ImNvbGluLmZhaXZyZUBnbWFpbC5jb20ifQ.f7FoazzMAhF7OJqAasDauqxKoYMWyanHxs3IIZz4ZxLEOh2HjzFFW-iwanl3Jl7n8FpkyNfFA-mCrKhkQndKmLfWV0tcqlo90rBXfYQT_bK94w79yglDqKz-R0vuL-Cfi3GDraf-vkN1QK3_ZpXunF7aPXi8rf_NpL3LKKC1lxJQfQ4fRwKDGUqNi68aJZoP5Lq52znHvmhZwCIvZ5ZVCwN-hjg7up9q0i7-sdBCZPPw9VMnZBTcxeThFznJbkSlcjYVvWUFtUGkO3-w8ByVjR9HPIfFiWVea7PO8IO2L8Rrb3qvQd8N5M7qlB3LxaqwTFF0BaYoQHg9F0Xm4hROJg',
    id: '6a5b1c40-6740-4665-a7f5-95b6d70cfd5f',
    id_token: 'foobar',
    keycloak_id: 'swp1JsfpyX5CMErRXMKS-dLrPlyp4kAsyU6vXbS9zfg',
    userFromApi: {
      birthdate: null,
      pronouns: '',
      short_description: '',
      description: '',
      location: '',
      job: 'frontend developer freelance',
      sdgs: [1, 2],
      profile_picture: null,
      id: 24,
      language: 'en',
      keycloak_id: '1cb609f9-b5c5-4f09-89cd-218a00545c70',
      people_id: '744cf291-0bde-4d0f-a7d6-0b0f7142be88',
      email: 'fares.doghri@cri-paris.org',
      given_name: 'Fares',
      family_name: 'Doghri',
    },
    userFromToken: {
      exp: 1634120924,
      iat: 1634120624,
      auth_time: 1634120622,
      jti: 'a56cb7b3-54de-4925-b285-f8eeb3ad2121',
      iss: 'https://keycloak.k8s.dev.azure.cri-paris.tech/auth/realms/LearningPlanet',
      aud: ['realm-management', 'account'],
      sub: 'e8f1c7e1-0185-44f4-9295-a672e41adf16',
      typ: 'Bearer',
      azp: 'projects-pkce',
      session_state: 'a0bb308e-02a2-49b5-aba3-66ba3b656662',
      acr: '1',
      'allowed-origins': ['*'],
      realm_access: {
        roles: ['offline_access', 'default-roles-learningplanet', 'uma_authorization'],
      },
      resource_access: {
        'realm-management': {
          roles: ['view-realm', 'create-client', 'view-clients', 'manage-clients', 'query-clients'],
        },
        account: {
          roles: ['manage-account', 'manage-account-links', 'view-profile'],
        },
      },
      scope: 'openid email profile',
      sid: 'a0bb308e-02a2-49b5-aba3-66ba3b656662',
      email_verified: true,
      name: 'Colin Faivre',
      preferred_username: 'colin.faivre@gmail.com',
      locale: 'fr',
      given_name: 'Colin',
      family_name: 'Faivre',
      email: 'colin.faivre@gmail.com',
    },
    permissions: [
      'organization.create',
      'organization.retrieve',
      'organization.list',
      'organization.destroy',
      'organization.update',
      'organization.partial_update',
      'organization.image',
      'organization.member',
      'organization.group',
    ],
    roles: [],
    notificationsCount: 0,
    notificationsSettings: null,
  }
  const stateWithoutSessionToken = {
    refreshToken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJydCI6eyJwaWQiOiI2YTViMWM0MC02NzQwLTQ2NjUtYTdmNS05NWI2ZDcwY2ZkNWYifSwiZXhwIjoxNjMzNzY0NjU3fQ.iIG2cjz5Tn4kq1_qiIfiCi-SoR8ZREUKoQBBgfd4c9AMhl2V4SDY47GmAImHc5XUu3hq2k0hoWGvlrBON3DwZQ',
    accessToken: '',
    id: '6a5b1c40-6740-4665-a7f5-95b6d70cfd5f',
    id_token: 'foobar',
    keycloak_id: 'swp1JsfpyX5CMErRXMKS-dLrPlyp4kAsyU6vXbS9zfg',
    permissions: [
      'organization.create',
      'organization.retrieve',
      'organization.list',
      'organization.destroy',
      'organization.update',
      'organization.partial_update',
      'organization.image',
      'organization.member',
      'organization.group',
    ],
    userFromToken: null,
    userFromApi: null,
    roles: [],
    notificationsCount: 0,
    notificationsSettings: null,
  }
  const stateWithUserWithSpecialCharacter = {
    refreshToken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJydCI6eyJwaWQiOiI2YTViMWM0MC02NzQwLTQ2NjUtYTdmNS05NWI2ZDcwY2ZkNWYifSwiZXhwIjoxNjMzNzY0NjU3fQ.iIG2cjz5Tn4kq1_qiIfiCi-SoR8ZREUKoQBBgfd4c9AMhl2V4SDY47GmAImHc5XUu3hq2k0hoWGvlrBON3DwZQ',
    accessToken:
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4dEVDUnNWai1HT3EzcXY3bVVJTDdfQUNjQ2JHZ3NwQ2FsaE55WndKbzM4In0.eyJqdGkiOiIzYjRjNmU4OS1kMjJkLTRmYWItODcyNC1mOTk4ZDY0YjRlYTQiLCJleHAiOjE2MzgzMTI0MDAsIm5iZiI6MCwiaWF0IjoxNjM4Mjc2NDk4LCJpc3MiOiJodHRwczovL2lkLmxlYXJuaW5nLXBsYW5ldC5vcmcvYXV0aC9yZWFsbXMvbHAiLCJzdWIiOiI0Y2Y4OWIxMS0zMjRiLTRmN2EtYTJhOC1kN2U0MWJmMmE1YWIiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwcm9qZWN0cy1mcm9udGVuZC1kZXYiLCJhdXRoX3RpbWUiOjE2MzgyNzY0MDAsInNlc3Npb25fc3RhdGUiOiJkZTZiYjU5Ni1kOGQyLTRkN2MtYWJlYy0zNGZhOTRiOTczNmUiLCJhY3IiOiIwIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsImh0dHA6Ly8xMjcuMC4wLjE6ODA4MCIsImh0dHBzOi8vcHJvamVjdHMuZGV2LmNyaS1wYXJpcy5vcmciLCJodHRwczovLzEyNy4wLjAuMTo4MDgwIiwiaHR0cHM6Ly9sb2NhbGhvc3Q6ODA4MCJdLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJow6lucmkgZGVsb3phbm5lIiwiZ3JvdXBzIjpbIi9wcm9qZWN0cy9hZG1pbmlzdHJhdG9ycyJdLCJwaWQiOiJlM2NiZGFlYy03N2E0LTQ0ZDEtODA2Zi0zNzk2ZTY3MGVhYWMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJoZW5yaS5kZWxvemFubmVAZXh0ZXJuYWwuY3JpLXBhcmlzLm9yZyIsImdpdmVuX25hbWUiOiJow6lucmkiLCJmYW1pbHlfbmFtZSI6ImRlbG96YW5uZSIsImVtYWlsIjoiaG5yLmRlbG96YW5uZUBnbWFpbC5jb20ifQ.BqwLuO8EvvXWs1AN4-PscW5TArVHWVjbeHu1uzcwnrgNwhsFtIzfMljPBNi8jfqC9WzYUv1ikIyaSvU9QUu16IKyayT_nUcPlahBIt07lWRQlEDE9Dlczaq5twTxEzBOQTSEhYiucGUfG9FXpjp_Ijxvk1gYVqGJbbfH2boNZl7LSfP_Cp5ZSpRqFABgEfdvhY2S-m0hF7VBzSs7icBg_-eqvTGxabRmh7Y25y_UJuA2NaYWNcwN_osa8V4fzLhqRgRrQbOZP337nRnColj5ByPEj-BR2mnSa18LY4tckKaMgpUXUsT0c6q4FqDZQJkXBl2d5IWONJEecLVLyOAslg',
    id: '6a5b1c40-6740-4665-a7f5-95b6d70cfd5f',
    id_token: 'foobar',
    keycloak_id: 'xtECRsVj-GOq3qv7mUIL7_ACcCbGgspCalhNyZwJo38',
    userFromApi: {
      profile: {
        birthdate: null,
        pronouns: '',
        short_description: '',
        description: '',
        location: '',
        job: 'frontend developer freelance',
        sdgs: [1, 2],
      },
      profile_picture: null,
      id: 24,
      language: 'en',
      keycloak_id: '1cb609f9-b5c5-4f09-89cd-218a00545c70',
      people_id: '744cf291-0bde-4d0f-a7d6-0b0f7142be88',
      email: 'fares.doghri@cri-paris.org',
      given_name: 'Fares',
      family_name: 'Doghri',
    },
    userFromToken: {
      jti: '3b4c6e89-d22d-4fab-8724-f998d64b4ea4',
      exp: 1638312400,
      nbf: 0,
      iat: 1638276498,
      iss: 'https://id.learning-planet.org/auth/realms/lp',
      sub: '4cf89b11-324b-4f7a-a2a8-d7e41bf2a5ab',
      typ: 'Bearer',
      azp: 'projects-frontend-dev',
      auth_time: 1638276400,
      session_state: 'de6bb596-d8d2-4d7c-abec-34fa94b9736e',
      acr: '0',
      'allowed-origins': [
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'https://projects.dev.cri-paris.org',
        'https://127.0.0.1:8080',
        'https://localhost:8080',
      ],
      scope: 'openid profile email',
      email_verified: true,
      name: 'hénri delozanne',
      roles: ['/projects/administrators'],
      pid: 'e3cbdaec-77a4-44d1-806f-3796e670eaac',
      preferred_username: 'henri.delozanne@external.cri-paris.org',
      given_name: 'hénri',
      family_name: 'delozanne',
      email: 'hnr.delozanne@gmail.com',
    },
    permissions: [
      'organization.create',
      'organization.retrieve',
      'organization.list',
      'organization.destroy',
      'organization.update',
      'organization.partial_update',
      'organization.image',
      'organization.member',
      'organization.group',
    ],
    roles: [],
    notificationsCount: 0,
    notificationsSettings: null,
  }

  it('isConnected', () => {
    let usersStore = useUsersStore(pinia)
    usersStore.$patch(stateWithSessionToken as any)
    expect(usersStore.isConnected).toBe(true)

    usersStore.$patch(stateWithoutSessionToken as any)
    expect(usersStore.isConnected).toBe(false)
  })

  it('user', () => {
    let usersStore = useUsersStore(pinia)
    usersStore.$patch(stateWithSessionToken as any)
    expect(usersStore.user).toEqual({
      name: {
        firstname: stateWithSessionToken.userFromToken.given_name,
        lastname: stateWithSessionToken.userFromToken.family_name,
      },
      email: stateWithSessionToken.userFromToken.email,
      roles: [],
      orgs: funct.getOrgsFromRoles([]),
      permissions: [
        'organization.create',
        'organization.retrieve',
        'organization.list',
        'organization.destroy',
        'organization.update',
        'organization.partial_update',
        'organization.image',
        'organization.member',
        'organization.group',
      ],
      signed_terms_and_conditions: {},
    })

    usersStore.$patch(stateWithoutSessionToken as any)
    expect(usersStore.user).toBe(null)
  })

  it('properly displays special characters in user name', () => {
    const userFromJWT = stateWithUserWithSpecialCharacter.userFromToken
    userFromJWT.given_name = 'hénri'

    const spy = vi.spyOn(auth, 'refreshAccessToken').mockResolvedValueOnce({
      refresh_token: stateWithUserWithSpecialCharacter.refreshToken,
      access_token: stateWithUserWithSpecialCharacter.accessToken,
      parsedToken: userFromJWT,
    })
    let usersStore = useUsersStore(pinia)
    usersStore.$patch(stateWithUserWithSpecialCharacter as any)
    expect(usersStore.user.name.firstname).toBe('hénri')
    spy.mockReset()
  })

  it('refreshToken', () => {
    let usersStore = useUsersStore(pinia)
    usersStore.$patch(stateWithSessionToken as any)
    expect(usersStore.refreshToken).toBe(stateWithSessionToken.refreshToken)
  })
})

describe('Store module | users | actions', () => {
  let pinia
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
  })
  afterEach(() => {
    // usersStore.$reset()
  })

  it('logOut', async () => {
    let usersStore = useUsersStore(pinia)
    const logoutFromKeycloakMock = auth.logoutFromKeycloak as Mock
    vi.spyOn(usersStore, 'resetUser')

    await usersStore.logOut()
    await flushPromises()
    expect(removeApiCookie).toHaveBeenCalled()
    expect(logoutFromKeycloakMock).toHaveBeenCalled()
    waitForExpect(() => expect(usersStore.resetUser).toHaveBeenCalledTimes(1))
  })

  it('logIn', async () => {
    const keycloakID = 'e55f9554-e1b2-487e-8d88-ec18c99a388a'
    const identifyUserMock = analytics.identifyUser as Mock
    const refresh_token =
      'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0NWUwOTFkNi00YzQxLTQwZWItYTI3ZC1kOGM2ODQ4OGM3YjEifQ.eyJleHAiOjE2NDY4NDE5MDUsImlhdCI6MTY0Njg0MDEwNSwianRpIjoiNjVhYmZlZTItYjAxYi00NzhiLTlkZDAtYjUwNGU3NjlmMjRhIiwiaXNzIjoiaHR0cHM6Ly9pZC5sZWFybmluZy1wbGFuZXQub3JnL2F1dGgvcmVhbG1zL2xwIiwiYXVkIjoiaHR0cHM6Ly9pZC5sZWFybmluZy1wbGFuZXQub3JnL2F1dGgvcmVhbG1zL2xwIiwic3ViIjoiZTU1Zjk1NTQtZTFiMi00ODdlLThkODgtZWMxOGM5OWEzODhhIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InByb2plY3RzLWZyb250ZW5kLWRldiIsInNlc3Npb25fc3RhdGUiOiJlOGM5M2ZhYS0yZjNkLTRjMDUtYjUxNy01YmNhMDYwMDA4YjUiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic2lkIjoiZThjOTNmYWEtMmYzZC00YzA1LWI1MTctNWJjYTA2MDAwOGI1In0.wQvwBxUtTpGRO6nlgaYgtd2SiHSqQqp4HbqgoeYzTaE'
    const access_token =
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4dEVDUnNWai1HT3EzcXY3bVVJTDdfQUNjQ2JHZ3NwQ2FsaE55WndKbzM4In0.eyJleHAiOjE2NDY4NzYxMDAsImlhdCI6MTY0Njg0MDEwNSwiYXV0aF90aW1lIjoxNjQ2ODQwMTAwLCJqdGkiOiIxMjE4ZTA4My02YmE4LTQzZDYtYjVlYi1kNzMxMjQ2MTljYjUiLCJpc3MiOiJodHRwczovL2lkLmxlYXJuaW5nLXBsYW5ldC5vcmcvYXV0aC9yZWFsbXMvbHAiLCJzdWIiOiJlNTVmOTU1NC1lMWIyLTQ4N2UtOGQ4OC1lYzE4Yzk5YTM4OGEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwcm9qZWN0cy1mcm9udGVuZC1kZXYiLCJzZXNzaW9uX3N0YXRlIjoiZThjOTNmYWEtMmYzZC00YzA1LWI1MTctNWJjYTA2MDAwOGI1IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3Byb2ZpbGUucHJvamVjdHMuZGV2LmxwLWkuZGV2IiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiaHR0cDovLzEyNy4wLjAuMTo4MDgwIiwiaHR0cHM6Ly9wcm9qZWN0cy5kZXYuY3JpLXBhcmlzLm9yZyIsImh0dHBzOi8vMTI3LjAuMC4xOjgwODAiLCJodHRwczovL2xvY2FsaG9zdDo4MDgwIl0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiJlOGM5M2ZhYS0yZjNkLTRjMDUtYjUxNy01YmNhMDYwMDA4YjUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6InRlc3QgYXV0byIsImdyb3VwcyI6WyIvcHJvamVjdHMvcG9ydGFscy9DWS91c2VycyIsIi9wcm9qZWN0cy9wb3J0YWxzL0NBVEkvdXNlcnMiXSwicGlkIjoiNGUxMzRjMWEtYmQ1My00MzZkLWFkMTEtMDI5ODJiMTljZDljIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdC5hdXRvQGV4dGVybmFsLmNyaS1wYXJpcy5vcmciLCJnaXZlbl9uYW1lIjoidGVzdCIsImZhbWlseV9uYW1lIjoiYXV0byIsInVzZXIiOnsiaWQiOiI0ZTEzNGMxYS1iZDUzLTQzNmQtYWQxMS0wMjk4MmIxOWNkOWMifSwiZW1haWwiOiJ0ZXN0LmF1dG8uY3JpQHlvcG1haWwuY29tIn0.N7MQ2PQq1fRSFPOxE8gBWZRGeT8YKruKvCPTTOXYJtYBPfDlfi7mBCqdVne5lvYeOKU0j8DY-flA-UsRYuzE49pXGBiLLq6mSZ-GYX34knG9muxBNJ_pWc-p9zWPcBDG2yKkRiId5dFVvSbcm5_l-jAx2W25cZakND8omYFO6iFP_fWiCjnQvNFTcK5zwzIaQZRqAsCafs0TCVCVkJuqR3yvPi3X9WjKXEbUxlP0Qilm9KgkqeqXjbrdmJuERSP1eCSnwZVKn_DfTVEbIcOG4PQzpi7FZmQl47eE97p6tseEZtFiBtFqSleRZ3qpWGqrfHdHV0Y4n0_kfpec2xI9Ug'
    const id_token = 'foobar'
    const parsedToken = {
      exp: 1646876100,
      iat: 1646840105,
      auth_time: 1646840100,
      jti: '1218e083-6ba8-43d6-b5eb-d73124619cb5',
      iss: 'https://id.learning-planet.org/auth/realms/lp',
      sub: 'e55f9554-e1b2-487e-8d88-ec18c99a388a',
      typ: 'Bearer',
      azp: 'projects-frontend-dev',
      session_state: 'e8c93faa-2f3d-4c05-b517-5bca060008b5',
      acr: '1',
      'allowed-origins': [
        'https://profile.projects.dev.lp-i.dev',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'https://projects.dev.cri-paris.org',
        'https://127.0.0.1:8080',
        'https://localhost:8080',
      ],
      scope: 'openid profile email',
      sid: 'e8c93faa-2f3d-4c05-b517-5bca060008b5',
      email_verified: true,
      name: 'test auto',
      roles: ['/projects/portals/CY/users', '/projects/portals/CATI/users'],
      preferred_username: 'test.auto@external.cri-paris.org',
      given_name: 'test',
      family_name: 'auto',
      email: 'test.auto.cri@yopmail.com',
    }

    let usersStore = useUsersStore(pinia)
    vi.spyOn(usersStore, 'logIn')

    await usersStore.logIn({
      refresh_token,
      refresh_token_exp: 1646876100,
      access_token,
      id_token,
      parsedToken: parsedToken,
      fromURL: '/dashboard',
    })

    // expect(usersStore.logIn).toHaveBeenLastCalledWith({
    //     refreshToken: refresh_token,
    //     refreshTokenExp: 1646876100,
    //     accessToken: access_token,
    //     id_token: id_token,
    //     keycloak_id: keycloakID,
    //     userFromToken: parsedToken,
    // })
    expect(identifyUserMock).toHaveBeenCalledWith(keycloakID)
  })

  it('refreshToken', async () => {
    const pid = '4e134c1a-bd53-436d-ad11-02982b19cd9c'
    const keycloakID = 'e55f9554-e1b2-487e-8d88-ec18c99a388a'
    const refresh_token =
      'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0NWUwOTFkNi00YzQxLTQwZWItYTI3ZC1kOGM2ODQ4OGM3YjEifQ.eyJleHAiOjE2NDY4NDE5MDUsImlhdCI6MTY0Njg0MDEwNSwianRpIjoiNjVhYmZlZTItYjAxYi00NzhiLTlkZDAtYjUwNGU3NjlmMjRhIiwiaXNzIjoiaHR0cHM6Ly9pZC5sZWFybmluZy1wbGFuZXQub3JnL2F1dGgvcmVhbG1zL2xwIiwiYXVkIjoiaHR0cHM6Ly9pZC5sZWFybmluZy1wbGFuZXQub3JnL2F1dGgvcmVhbG1zL2xwIiwic3ViIjoiZTU1Zjk1NTQtZTFiMi00ODdlLThkODgtZWMxOGM5OWEzODhhIiwidHlwIjoiUmVmcmVzaCIsImF6cCI6InByb2plY3RzLWZyb250ZW5kLWRldiIsInNlc3Npb25fc3RhdGUiOiJlOGM5M2ZhYS0yZjNkLTRjMDUtYjUxNy01YmNhMDYwMDA4YjUiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic2lkIjoiZThjOTNmYWEtMmYzZC00YzA1LWI1MTctNWJjYTA2MDAwOGI1In0.wQvwBxUtTpGRO6nlgaYgtd2SiHSqQqp4HbqgoeYzTaE'
    const access_token =
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ4dEVDUnNWai1HT3EzcXY3bVVJTDdfQUNjQ2JHZ3NwQ2FsaE55WndKbzM4In0.eyJleHAiOjE2NDY4NzYxMDAsImlhdCI6MTY0Njg0MDEwNSwiYXV0aF90aW1lIjoxNjQ2ODQwMTAwLCJqdGkiOiIxMjE4ZTA4My02YmE4LTQzZDYtYjVlYi1kNzMxMjQ2MTljYjUiLCJpc3MiOiJodHRwczovL2lkLmxlYXJuaW5nLXBsYW5ldC5vcmcvYXV0aC9yZWFsbXMvbHAiLCJzdWIiOiJlNTVmOTU1NC1lMWIyLTQ4N2UtOGQ4OC1lYzE4Yzk5YTM4OGEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJwcm9qZWN0cy1mcm9udGVuZC1kZXYiLCJzZXNzaW9uX3N0YXRlIjoiZThjOTNmYWEtMmYzZC00YzA1LWI1MTctNWJjYTA2MDAwOGI1IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3Byb2ZpbGUucHJvamVjdHMuZGV2LmxwLWkuZGV2IiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiaHR0cDovLzEyNy4wLjAuMTo4MDgwIiwiaHR0cHM6Ly9wcm9qZWN0cy5kZXYuY3JpLXBhcmlzLm9yZyIsImh0dHBzOi8vMTI3LjAuMC4xOjgwODAiLCJodHRwczovL2xvY2FsaG9zdDo4MDgwIl0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJzaWQiOiJlOGM5M2ZhYS0yZjNkLTRjMDUtYjUxNy01YmNhMDYwMDA4YjUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6InRlc3QgYXV0byIsImdyb3VwcyI6WyIvcHJvamVjdHMvcG9ydGFscy9DWS91c2VycyIsIi9wcm9qZWN0cy9wb3J0YWxzL0NBVEkvdXNlcnMiXSwicGlkIjoiNGUxMzRjMWEtYmQ1My00MzZkLWFkMTEtMDI5ODJiMTljZDljIiwicHJlZmVycmVkX3VzZXJuYW1lIjoidGVzdC5hdXRvQGV4dGVybmFsLmNyaS1wYXJpcy5vcmciLCJnaXZlbl9uYW1lIjoidGVzdCIsImZhbWlseV9uYW1lIjoiYXV0byIsInVzZXIiOnsiaWQiOiI0ZTEzNGMxYS1iZDUzLTQzNmQtYWQxMS0wMjk4MmIxOWNkOWMifSwiZW1haWwiOiJ0ZXN0LmF1dG8uY3JpQHlvcG1haWwuY29tIn0.N7MQ2PQq1fRSFPOxE8gBWZRGeT8YKruKvCPTTOXYJtYBPfDlfi7mBCqdVne5lvYeOKU0j8DY-flA-UsRYuzE49pXGBiLLq6mSZ-GYX34knG9muxBNJ_pWc-p9zWPcBDG2yKkRiId5dFVvSbcm5_l-jAx2W25cZakND8omYFO6iFP_fWiCjnQvNFTcK5zwzIaQZRqAsCafs0TCVCVkJuqR3yvPi3X9WjKXEbUxlP0Qilm9KgkqeqXjbrdmJuERSP1eCSnwZVKn_DfTVEbIcOG4PQzpi7FZmQl47eE97p6tseEZtFiBtFqSleRZ3qpWGqrfHdHV0Y4n0_kfpec2xI9Ug'

    const parsedToken = {
      exp: 1646876100,
      iat: 1646840105,
      auth_time: 1646840100,
      jti: '1218e083-6ba8-43d6-b5eb-d73124619cb5',
      iss: 'https://id.learning-planet.org/auth/realms/lp',
      sub: 'e55f9554-e1b2-487e-8d88-ec18c99a388a',
      typ: 'Bearer',
      azp: 'projects-frontend-dev',
      session_state: 'e8c93faa-2f3d-4c05-b517-5bca060008b5',
      acr: '1',
      'allowed-origins': [
        'https://profile.projects.dev.lp-i.dev',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'https://projects.dev.cri-paris.org',
        'https://127.0.0.1:8080',
        'https://localhost:8080',
      ],
      scope: 'openid profile email',
      sid: 'e8c93faa-2f3d-4c05-b517-5bca060008b5',
      email_verified: true,
      name: 'test auto',
      roles: ['/projects/portals/CY/users', '/projects/portals/CATI/users'],
      pid: '4e134c1a-bd53-436d-ad11-02982b19cd9c',
      preferred_username: 'test.auto@external.cri-paris.org',
      given_name: 'test',
      family_name: 'auto',
      user: {
        id: '4e134c1a-bd53-436d-ad11-02982b19cd9c',
      },
      email: 'test.auto.cri@yopmail.com',
    }
    const id_token = 'foobar'

    const spy = vi.spyOn(auth, 'refreshAccessToken').mockResolvedValueOnce({
      refresh_token: refresh_token,
      refresh_token_exp: 123456,
      access_token: access_token,
      parsedToken: parsedToken,
      id_token: id_token,
    })
    let usersStore = useUsersStore(pinia)
    vi.spyOn(usersStore, 'setUser')
    await usersStore.doRefreshToken()
    waitForExpect(() =>
      expect(usersStore.setUser).toHaveBeenNthCalledWith(1, {
        refreshToken: refresh_token,
        refreshTokenExp: 123456,
        accessToken: access_token,
        keycloak_id: keycloakID,
        userFromToken: parsedToken,
        id_token: id_token,
      })
    )
    spy.mockReset()
  })
})

describe('Store module | users | mutations', () => {
  let pinia
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
  })
  afterEach(() => {
    // usersStore.$reset()
  })
  it('resetUser', () => {
    // TODO set an intial state ?
    let usersStore = useUsersStore(pinia)
    usersStore.resetUser()

    const desiredState = {
      refreshToken: '',
      accessToken: '',
      id_token: '',
      keycloak_id: '',
      permissions: {},
      userFromToken: null,
      userFromApi: null,

      roles: [],
      notificationsCount: 0,
      notificationsSettings: null,
    }
    for (let key of Object.keys(desiredState)) {
      expect(desiredState[key]).toEqual(usersStore[key])
    }
  })

  it('setUser', () => {
    const payload = {
      refreshToken: 'randomRefreshToken',
      accessToken: 'randomSessionToken',
      keycloak_id: 'swp1JsfpyX5CMErRXMKS-dLrPlyp4kAsyU6vXbS9zfg',
      id_token: 'foobar',
      userFromToken: {
        email: 'foo@bar.com',
      },
      userFromApi: null,
    }
    let usersStore = useUsersStore(pinia)
    usersStore.setUser(payload)

    const desiredState = {
      refreshToken: 'randomRefreshToken',
      accessToken: 'randomSessionToken',
      keycloak_id: 'swp1JsfpyX5CMErRXMKS-dLrPlyp4kAsyU6vXbS9zfg',
      id_token: 'foobar',
      userFromToken: {
        email: 'foo@bar.com',
      },
    }

    for (let key of Object.keys(desiredState)) {
      expect(desiredState[key]).toEqual(usersStore[key])
    }
  })
})
