export default function useImageAndDimensions(
  imageData,
  variation: 'full' | 'large' | 'medium' | 'small'
) {
  const image = imageData?.variations?.[variation]

  let variationWidth = {
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
