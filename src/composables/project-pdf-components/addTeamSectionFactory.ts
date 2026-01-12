import { Container } from '@/composables/pdf-helpers/doc-builder'
import { fetchImageAsDataUrl, proxyImageUrl } from '@/composables/pdf-helpers/usePdfHelpers'
import { usePatatoids } from '@/composables/usePatatoids'

export default async function addTeamSectionFactory(title: string, team: any[]) {
  const defaultPatatoid = usePatatoids()[0]
  const _team = await Promise.all(
    team.map(async (member) => {
      const avatarDataUrl = await fetchImageAsDataUrl(
        proxyImageUrl(member.profile_picture?.variations?.medium || defaultPatatoid)
      )
      return {
        ...member,
        avatar_url: avatarDataUrl,
      }
    })
  )

  const { getTranslatableField } = useAutoTranslate()
  return function addTeamSection(this: Container) {
    let out = ''
    if (team.length > 0) {
      this.styles.add(/* CSS */ `
          .team-section {
            break-inside: avoid;
            break-after: auto;
          }
          .team-list {
            margin-top: .6cm;
            display: grid;
            gap: 0.6cm;
            grid-template-columns: repeat(auto-fill, 4cm);
          }
          .team-section-title {
            font-size: .4cm;
            font-weight: bold;
            margin-bottom: .4cm;
            color: #1d727c;
            font-weight: bold;
          }
          .team-member {
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
            justify-content: flex-start;
          }
          .team-card-title{
            width: 100%;
            font-weight: 700;
            font-size: .4cm;
          }
          .team-card-photo {
            width: 3.5cm;
            height: 3.5cm;
            border-radius: 50%;
          }`)
      const teamList = _team
        .map(
          (member) => /*HTML*/ `
          <div class="team-member">
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
          <h3 class="team-section-title">${title}</h3>
          <div class="team-list">${teamList}</div>
        </div>
      `
    }
    this.content.push(out)
  }
}
