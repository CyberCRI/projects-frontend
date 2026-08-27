import { removeUserCookie } from 'shared-projects-frontend/apis'
import { useKeycloak } from '@dsb-norge/vue-keycloak-js'

export async function removeApiCookie() {
  // unset cookie for API proxy
  const keycloak = useKeycloak()

  await keycloak.logoutFn()
  return await removeUserCookie()
}
