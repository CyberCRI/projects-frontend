import { Container } from '@/composables/pdf-helpers/doc-builder'
import {
  croppedImageData,
  fetchImageAsDataUrl,
  proxyImageUrl,
} from '@/composables/pdf-helpers/usePdfHelpers'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils'
import { usePatatoids } from '@/composables/usePatatoids'
import { cardListStyles } from '@/composables/project-pdf-components/common-styles'

export default async function addTeamSectionFactory(title: string, team: any[]) {
  const defaultPatatoid = usePatatoids()[0]
  const _team = await Promise.all(
    team.map(async (member) => {
      const avatarDataUrl = await fetchImageAsDataUrl(
        proxyImageUrl(member.profile_picture?.variations?.medium || defaultPatatoid)
      )
      const imageSizes = pictureApiToImageSizes(member.profile_picture || null)
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
  return function addTeamSection(this: Container) {
    let out = ''
    if (team.length > 0) {
      this.styles.add(cardListStyles)
      this.styles.add(/* CSS */ `
          .team-card-title{
            width: 100%;
            font-weight: 700;
            font-size: 1rem;
          }
          .team-card-title {
            font-weight: 700;
          }
          .team-card-photo {
            --photo-size: 2cm;
            width: var(--photo-size);
            height: var(--photo-size);
            border-radius: 50%;
          }`)
      const teamList = _team
        .map(
          (member) => /*HTML*/ `
          <div class="card-item team-member">
            <img class="team-card-photo" src="${member.avatar_url}" alt="${member.given_name} ${member.family_name}"/>
            <div class="team-card-title">
            ${member.given_name} ${member.family_name}
            </div>
            <div class="team-card-description">
              ${getTranslatableField(member, 'job').value || ''}
            </div>
          </div>`
        )
        .join('')

      out = /* HTML */ `
        <div class="team-section">
          <h3 class="card-list-title team-section-title">${title}</h3>
          <div class="card-list team-list">${teamList}</div>
        </div>
      `
    }
    this.content.push(out)
  }
}
