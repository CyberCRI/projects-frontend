import { getUser as globalGetUser, getOrganizationByCode } from 'shared-projects-frontend/apis'
import { isAdmin, isSuperAdmin, userRights } from 'shared-projects-frontend/lib'
import type { OrganizationModel } from 'shared-projects-frontend/models'

// TODO: add parseToken/jwt in shared-project-backend
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
    throw new Error(`Failed to parse JWT: ${error.message}`, { cause: error })
  }
}

export function getKeycloakIdFromToken(tokenHeader) {
  try {
    return parseJwt(tokenHeader).sub
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'bad_request',
      message: 'Malformed token.',
    })
  }
}

export async function getOrg(event): Promise<OrganizationModel | null> {
  const runtimeConfig = useRuntimeConfig()
  const orgCode = runtimeConfig.public.appApiOrgCode
  const tokenHeader = getRequestHeader(event, 'authorization') || ''

  return getOrganizationByCode(orgCode, {
    headers: { Authorization: tokenHeader },
  }).catch((e) => {
    throw createError({
      statusCode: 401,
      statusMessage: 'no_org',
      message: 'Could not retrieve org: ' + e.toString(),
    })
  })
}

export async function getUser(event) {
  const tokenHeader = getRequestHeader(event, 'authorization') || ''
  const kcId = getKeycloakIdFromToken(tokenHeader)

  return globalGetUser(kcId, {
    headers: { Authorization: tokenHeader },
  }).catch((e) => {
    throw createError({
      statusCode: 401,
      statusMessage: 'no_user',
      message: 'Could not retrieve user: ' + e.toString(),
    })
  })
}

export default async function checkAdminRights(event) {
  const organization = await getOrg(event)

  const user = await getUser(event)
  const rights = userRights(user)

  const superAdmin = isSuperAdmin(rights)
  const admin = isAdmin(rights, organization.id)

  if (!superAdmin && !admin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You do not have permission to access this resource.',
    })
  }
  return {
    user,
    admin,
    superAdmin,
  }
}
