import { Container } from '@/composables/pdf-helpers/doc-builder'
import {
  croppedImageData,
  fetchImageAsDataUrl,
  proxyImageUrl,
} from '@/composables/pdf-helpers/usePdfHelpers'
import { usePatatoids } from '@/composables/usePatatoids'
import { cardListStyles } from '@/composables/project-pdf-components/common-styles'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils'

export default async function addGroupSectionFactory(title: string, group: any[]) {
  const defaultPatatoid = usePatatoids()[0]
  const _group = await Promise.all(
    group.map(async (member) => {
      const avatarDataUrl = await fetchImageAsDataUrl(
        proxyImageUrl(member.header_image?.variations?.medium || defaultPatatoid)
      )
      const imageSizes = pictureApiToImageSizes(member.header_image || null)
      const croppedAvatarDataUrl = await croppedImageData({
        imgDataUrl: avatarDataUrl,
        ratio: 1,
        imageSizes,
      })
      return {
        ...member,
        avatar_url: croppedAvatarDataUrl,
      }
    })
  )

  const { getTranslatableField } = useAutoTranslate()
  return function addGroupSection(this: Container) {
    let out = ''
    if (group.length > 0) {
      this.styles.add(cardListStyles)
      this.styles.add(/* CSS */ `
          .group-section {
            break-inside: avoid;
            break-after: auto;
          }
          .group-card-title{
            font-weight: 700;
          } 
          .group-card-photo {
             --photo-size: 2cm;
            width: var(--photo-size);
            height: var(--photo-size);
            border-radius: 50%;
          }`)
      const groupList = _group
        .map(
          (member) => /*HTML*/ `
          <div class="card-item group-member">
            <img class="group-card-photo" src="${member.avatar_url}" alt="${getTranslatableField(member, 'name').value || ''}"/>
            <div class="group-card-group-count">
            </div>
            <div class="group-card-title">
            ${getTranslatableField(member, 'name').value || ''}
            </div>
            <p class="group-card-description">
              ${(getTranslatableField(member, 'short_description').value || '').slice(0, 100)}
            </p>
          </div>`
        )
        .join('')

      out = /* HTML */ `
        <div class="group-section">
          <h3 class="card-list-title group-section-title">${title}</h3>
          <div class="card-list group-list">${groupList}</div>
        </div>
      `
    }
    this.content.push(out)
  }
}
