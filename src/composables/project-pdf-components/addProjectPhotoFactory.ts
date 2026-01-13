import { Container } from '@/composables/pdf-helpers/doc-builder'
import {
  croppedImageData,
  fetchImageAsDataUrl,
  proxyImageUrl,
} from '@/composables/pdf-helpers/usePdfHelpers'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils'

export default async function addProjectPhotoFactory(project: any) {
  const runtimeConfig = useRuntimeConfig()
  const defaultProjectPicture = `${runtimeConfig.public.appPublicBinariesPrefix}/placeholders/header_placeholder.png`
  const projectPhoto = project.header_image?.variations?.medium || defaultProjectPicture
  const projectPhotoDataUrl = await fetchImageAsDataUrl(proxyImageUrl(projectPhoto))

  const imageSizes = pictureApiToImageSizes(project.header_image || null)
  const croppedPhotoDataUrl = await croppedImageData({
    imgDataUrl: projectPhotoDataUrl,
    ratio: 1,
    imageSizes,
  })

  return function addProjectPhoto(this: Container) {
    this.styles.add(/* CSS */ `
          .project-photo {
            width: 5cm;
            height: 5cm;
            flex-basis:5cm;
            flex-shrink:0;
            flex-grow:0;
          }
          `)
    this.content.push(/* HTML */ `
      <img class="project-photo" src="${croppedPhotoDataUrl}" alt="Project Image" />
    `)
  }
}
