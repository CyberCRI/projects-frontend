import { removeUserCookie } from 'shared-projects-frontend/apis'

export async function removeApiCookie() {
  // unset cookie for API proxy
  document.cookie = 'jwt_access_token=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;'
  return await removeUserCookie()
}
