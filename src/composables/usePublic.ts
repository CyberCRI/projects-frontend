/**
 * prefix url with backend s3 url
 *
 * @function
 * @name usePublicURL
 * @kind variable
 * @param {any} url
 * @returns {string}
 * @exports
 */
export const usePublicURL = (url: string) => {
  const runtimeConfig = useRuntimeConfig()
  const prefix = runtimeConfig.public.appPublicBinariesPrefix

  // fix already url prefixed by public binaries
  if (url.startsWith(prefix)) {
    return url
  }
  // fix if url is not started with slash
  if (!url.startsWith('/')) {
    url = `/${url}`
  }
  return `${prefix}${url}`
}
