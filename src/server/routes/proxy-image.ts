export default defineEventHandler(async (event) => {
  const target = getQuery(event)?.url as string
  if (
    !target?.match(
      /^https:\/\/(criparisprodprodassets|criparisdevlabassets|criparisdevlabprojects).blob.core.windows.net\//
    )
  ) {
    // return 404
    event.node.res.statusCode = 404
    return { error: 'Not found' }
  }
  return proxyRequest(event, target)
})
