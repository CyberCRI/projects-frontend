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
  return `${runtimeConfig.public.appPublicBinariesPrefix}${url}`
}
