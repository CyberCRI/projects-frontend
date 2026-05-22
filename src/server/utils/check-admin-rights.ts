import type { OrganizationModel } from '~/models/organization.model'
import type { UserModel } from '~/models/user.model'

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) {
      throw new Error('Invalid token format: missing payload')
    }

    // Convert URL-safe base64 to standard base64
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    // Add padding if needed
    const padding = '='.repeat((4 - (base64.length % 4)) % 4)
    base64 += padding

    // Decode using Buffer directly (no need for the complex map)
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8')

    return JSON.parse(jsonPayload)
  } catch (error) {
    throw new Error(`Failed to parse JWT: ${error.message}`)
  }
}

export function getKeycloakIdFromToken(tokenHeader) {
  let kcId = null
  try {
    const jwt = parseJwt(tokenHeader)
    kcId = jwt.sub
  } catch (err) {
    console.error(err)
    throw createError({
      statusCode: 400,
      statusMessage: 'bad_request',
      message: 'Malformed token.',
    })
  }

  return kcId
}

export async function getOrg(event): Promise<OrganizationModel | null> {
  const runtimeConfig = useRuntimeConfig()
  const orgCode = runtimeConfig.public.appApiOrgCode
  const tokenHeader = getRequestHeader(event, 'authorization') || ''
  let org
  try {
    const baseUrl = runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/'
    org = await $fetch(`${baseUrl}/organization/${orgCode}/`, {
      headers: { Authorization: tokenHeader },
    })
  } catch (e) {
    throw createError({
      statusCode: 401,
      statusMessage: 'no_org',
      message: 'Could not retrieve org: ' + e.toString(),
    })
  }
  return org
}

export async function getUserByKeycloakId(kcId, tokenHeader): Promise<UserModel | null> {
  let user = null
  try {
    const runtimeConfig = useRuntimeConfig()
    const baseUrl = runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/'
    user = await $fetch(`${baseUrl}/user/${kcId}/`, {
      headers: { Authorization: tokenHeader },
    })
  } catch (e) {
    throw createError({
      statusCode: 401,
      statusMessage: 'no_user',
      message: 'Could not retrieve user: ' + e.toString(),
    })
  }

  return user
}

export function isSuperAdmin(user) {
  return !!user?.is_superuser
}
export function isAdmin(user, orgId) {
  return (user.roles || []).some((role) => role === `organization:#${orgId}:admins`)
}

export async function getUser(event) {
  const tokenHeader = getRequestHeader(event, 'authorization') || ''
  const kcId = getKeycloakIdFromToken(tokenHeader)
  const user = await getUserByKeycloakId(kcId, tokenHeader)
  return user
}

export default async function checkAdminRights(event) {
  const user = await getUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'You must authenticate to access this resource.',
    })
  }
  const org = await getOrg(event)
  const orgId = org?.id
  if (!isSuperAdmin(user) && !isAdmin(user, orgId)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You do not have permission to access this resource.',
    })
  }
}
