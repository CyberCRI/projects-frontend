import {
  croppedImageData,
  fetchImageAsDataUrl,
  proxyImageUrl,
} from '~/composables/pdf-helpers/usePdfHelpers'
import { cardListStyles } from '~/composables/project-pdf-components/common-styles'
import type { Container } from '~/composables/pdf-helpers/doc-builder'

import type { TranslatedPeopleGroupModel } from '@/models/people-group.model'
import { pictureApiToImageSizes } from '~/functs/imageSizesUtils'
import { cropIfTooLong } from '~/functs/string'

export default async function addGroupSectionFactory(
  title: string,
  groups: TranslatedPeopleGroupModel[]
) {
  const _group = await Promise.all(
    groups.map(async (group) => {
      const avatarDataUrl = await fetchImageAsDataUrl(
        proxyImageUrl(
          group.header_image?.variations?.medium || usePublicURL(DEFAULT_GROUP_PATATOID)
        )
      )
      const imageSizes = pictureApiToImageSizes(group.header_image || null)
      const croppedAvatarDataUrl = await croppedImageData({
        imgDataUrl: avatarDataUrl,
        ratio: 1,
        imageSizes,
      })
      return {
        ...group,
        avatar_url: croppedAvatarDataUrl,
      }
    })
  )

  return function addGroupSection(this: Container) {
    if (groups.length === 0) {
      return
    }
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
        (group) => /*HTML*/ `
        <div class="card-item group-member">
          <img class="group-card-photo" src="${group.avatar_url}" alt="${group.$t.name}"/>
          <div class="group-card-group-count">
          </div>
          <div class="group-card-title">
          ${group.$t.name}
          </div>
          <p class="group-card-description">
            ${cropIfTooLong(group.$t.short_description, 100)}
          </p>
        </div>`
      )
      .join('')

    this.content.push(/* HTML */ `
      <div class="group-section">
        <h3 class="card-list-title group-section-title">${title}</h3>
        <div class="card-list group-list">${groupList}</div>
      </div>
    `)
  }
}
