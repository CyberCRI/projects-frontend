import { Container } from '@/composables/pdf-helpers/doc-builder'
import { fetchImageAsDataUrl, proxyImageUrl } from '@/composables/pdf-helpers/usePdfHelpers'
import { usePatatoids } from '@/composables/usePatatoids'

export default async function addLinkedProjectSectionFactory(linkedProjects: any[]) {
  const defaultPatatoid = usePatatoids()[0]
  const _linkedProjects = await Promise.all(
    linkedProjects.map(async (linkedProject) => {
      const avatarDataUrl = await fetchImageAsDataUrl(
        proxyImageUrl(linkedProject.project.header_image?.variations?.medium || defaultPatatoid)
      )
      return {
        ...linkedProject,
        photo_url: avatarDataUrl,
      }
    })
  )

  const { getTranslatableField } = useAutoTranslate()
  return function addLinkedProjectSection(this: Container) {
    let out = ''
    if (_linkedProjects.length > 0) {
      this.styles.add(/* CSS */ `
          .linked-project-section {
            break-inside: avoid;
            break-after: auto;
          }
          .linked-project-list {
            margin-top: .6cm;
            display: grid;
            gap: 0.6cm;
            grid-template-columns: repeat(auto-fill, 4cm);
          }
         
          .linked-project {
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

          .linked-project .category-name,
          .linked-project .card-title,
          .linked-project .card-description {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .linked-project .category-name {
            -webkit-line-clamp: 2; // if you change this change also purposeClamp() computed
            width: 100%;
            color: #1d727c;
            font-weight: 700;
            font-size: .3cm;
            text-transform: uppercase;
            margin-top: .2cm;
          }

          .linked-project .card-title {
            -webkit-line-clamp: 5; // if you change this change also purposeClamp() computed
            width: 100%;
            font-weight: 700;
            font-size: .4cm;
          }

          .linked-project .card-description {
            -webkit-line-clamp: 1;
          }

          .linked-project .card-description {
            -webkit-line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .linked-project-photo {
            width: 3.5cm;
            height: 3.5cm;
            border-radius: .1cm;
          }`)
      const linkedProjectList = _linkedProjects
        .map(
          (linkedProject) => /*HTML*/ `
          <div class="linked-project">
            <img class="linked-project-photo" src="${linkedProject.photo_url}" alt="${getTranslatableField(linkedProject.project, 'title').value}"/>
            <div class="card-type">
              <div class="category-name">
                ${linkedProject.project.categories[0].name}
              </div>
            </div>
            <div class="card-title">
              ${getTranslatableField(linkedProject.project, 'title').value}
            </div>
            <div  class="card-description">
              ${getTranslatableField(linkedProject.project, 'purpose').value}
            </div>
          </div>`
        )
        .join('')

      out = /* HTML */ `
        <div class="linked-project-list">${linkedProjectList}</div>
      `
    }
    this.content.push(out)
  }
}
