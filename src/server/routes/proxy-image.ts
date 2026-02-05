export default defineEventHandler(async (event) => {
  const target = getQuery(event)?.url as string
  if (
    // TODO: use environment variables to define allowed domains
    !target?.match(
      /^https:\/\/(criparisprodprodassets|criparisdevlabassets|criparisdevlabprojects|criparisprodprodprojects).blob.core.windows.net\//
    )
  ) {
    // return 404
    event.node.res.statusCode = 404
    return { error: 'Not found' }
  }
  return proxyRequest(event, target)
})
