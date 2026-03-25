function atob(b64Encoded) {
  return Buffer.from(b64Encoded, 'base64').toString()
}

export function parseJwt(token) {
  let base64Url = token.split('.')[1]
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )

  return JSON.parse(jsonPayload)
}

export default async function checkVectorDbRights(event) {
  const tokenHeader = getRequestHeader(event, 'authorization') || ''
  if (!tokenHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'You must authenticate to access this resource.',
    })
  }

  let kcId = null
  try {
    const jwt = parseJwt(tokenHeader)
    kcId = jwt.sub
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'bad_request',
      message: 'Malformed token.',
    })
  }

  let user = null
  try {
    const runtimeConfig = useRuntimeConfig()
    const baseUrl = runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/'
    user = await $fetch(`${baseUrl}/user/${kcId}/`, {
      headers: { Authorization: tokenHeader },
    })
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: 'server_error',
      message: 'Could not retrieve user: ' + e.toString(),
    })
  }

  if (!user?.is_superuser) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You do not have permission to access this resource.',
    })
  }
}
