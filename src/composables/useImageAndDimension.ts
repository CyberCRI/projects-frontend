export default function useImageAndDimensions(
  imageData,
  variation: 'full' | 'large' | 'medium' | 'small'
) {
  // const runtimeConfig = useRuntimeConfig()

  const originalImage = imageData?.variations?.[variation]

  const originalImageUrl = new URL(originalImage)
  const binaryDomain = originalImageUrl.origin
  const proxyPrefix = useRequestURL().origin + '/image-assets'

  // console.log('originalImage', originalImage)
  // console.log('binaryDomain', binaryDomain)
  // console.log('proxyPrefix', proxyPrefix)

  const image = originalImage?.replace(binaryDomain, proxyPrefix)
  // console.log('image', image)

  const variationWidth = {
    full: 1920,
    large: 1024,
    medium: 768,
    small: 500,
  }

  const width = variationWidth[variation]
  const height = Math.round((width * imageData?.height) / imageData?.width)
  const dimensions = { width, height }
  return { image, dimensions }
}
