export function parseJwt(token) {
  try {
    let base64Url = token.split('.')[1]
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

export async function getUserByKeycloakId(kcId, tokenHeader) {
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

export async function isSuperAdmin(user) {
  return !!user?.is_superuser
}

export default async function checkSuperAdminRights(event) {
  const tokenHeader = getRequestHeader(event, 'authorization') || ''
  if (!tokenHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'You must authenticate to access this resource.',
    })
  }

  const kcId = getKeycloakIdFromToken(tokenHeader)
  const user = await getUserByKeycloakId(kcId, tokenHeader)

  if (!isSuperAdmin(user)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You do not have permission to access this resource.',
    })
  }
}
