function atob(b64Encoded) {
  return Buffer.from(b64Encoded, 'base64').toString()
}

export function parseJwt(token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(
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

  console.log(tokenHeader)

  const jwt = parseJwt(tokenHeader)

  console.log(jwt)

  const kcId = jwt.sub

  const runtimeConfig = useRuntimeConfig()
  const baseUrl = runtimeConfig.public.appApiUrl + runtimeConfig.public.appApiDefaultVersion + '/'
  const user = await $fetch(`${baseUrl}/user/${kcId}/`, { headers: { Authorization: tokenHeader } })

  console.log(user)
  console.log(user.is_superuser)

  if (!user.is_superuser) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'You do not have permission to access this resource.',
    })
  }
}
