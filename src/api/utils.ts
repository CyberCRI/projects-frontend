export const getFileFromURL = (url: string, filename?: string) => {
  filename ??= url.split('/').at(-1)
  return $fetch<Blob>(url, { responseType: 'blob' }).then((blob) => {
    return new File([blob], filename)
  })
}
