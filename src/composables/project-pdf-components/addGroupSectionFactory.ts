import { Container } from '@/composables/pdf-helpers/doc-builder'
import { fetchImageAsDataUrl, proxyImageUrl } from '@/composables/pdf-helpers/usePdfHelpers'
import { usePatatoids } from '@/composables/usePatatoids'

export default async function addGroupSectionFactory(title: string, group: any[]) {
  const defaultPatatoid = usePatatoids()[0]
  const _group = await Promise.all(
    group.map(async (member) => {
      const avatarDataUrl = await fetchImageAsDataUrl(
        proxyImageUrl(member.header_image?.variations?.medium || defaultPatatoid)
      )
      return {
        ...member,
        avatar_url: avatarDataUrl,
      }
    })
  )

  const { getTranslatableField } = useAutoTranslate()
  return function addGroupSection(this: Container) {
    let out = ''
    if (group.length > 0) {
      this.styles.add(/* CSS */ `
          .group-section {
            break-inside: avoid;
            break-after: auto;
          }
          .group-list {
            margin-top: .6cm;
            display: grid;
            gap: 0.6cm;
            grid-template-columns: repeat(auto-fill, 4cm);
          }
          .group-section-title {
            font-size: .4cm;
            font-weight: bold;
            margin-bottom: .4cm;
            color: #1d727c;
            font-weight: bold;
          }
          .group-member {
            width: 4cm;
            height: auto;
            padding: .2cm 0;
            border: 1px solid #1d727c;
            border-radius: .2cm;
            text-align: center;
            font-size: .3cm;
            display: flex;
            gap: .2cm;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .group-card-photo {
            width: 3.5cm;
            height: 3.5cm;
            border-radius: 50%;
          }`)
      const groupList = _group
        .map(
          (member) => /*HTML*/ `
          <div class="group-member">
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
          <h3 class="group-section-title">${title}</h3>
          <div class="group-list">${groupList}</div>
        </div>
      `
    }
    this.content.push(out)
  }
}
