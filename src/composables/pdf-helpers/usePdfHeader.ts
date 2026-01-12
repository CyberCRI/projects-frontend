import { Doc } from '@/composables/pdf-helpers/doc-builder'
import useOrganizationsStore from '@/stores/useOrganizations'
import { fetchImageAsDataUrl, proxyImageUrl } from '@/composables/pdf-helpers/usePdfHelpers'

export default async function usePdfHeader() {
  const organizationsStore = useOrganizationsStore()
  const _organisation = organizationsStore.current
  const { translateOrganization } = useAutoTranslate()
  const organisation = translateOrganization(_organisation)

  // const orgLogo = organisation.value?.logo_image?.variations?.medium
  // const logoDataUrl = orgLogo ? await fetchImageAsDataUrl(orgLogo) : null
  // weird cors issue for logo work around
  // TODO: fix cors issue on the server side
  // const logoElement = window?.document.querySelector('. header__logo')
  // const logoDataUrl = logoElement ? imageElementToDataUrl(logoElement) : null

  // let logoDataUrl: string | ArrayBuffer = ''
  // const logoImageId = organisation.value?.logo_image?.id
  // if (logoImageId) {
  //   const orgLogoUrl = `/v1/organization/${organisation.value.code}/image/${logoImageId}/`
  //   logoDataUrl = await fetchImageAsDataUrl(orgLogoUrl)
  // }

  const orgLogo = organisation.value?.logo_image?.variations?.medium
  let logoDataUrl: string | ArrayBuffer = ''
  if (orgLogo) {
    const proxyUrl = proxyImageUrl(orgLogo)
    logoDataUrl = orgLogo ? await fetchImageAsDataUrl(proxyUrl) : null
  }

  const headerContent = new Doc()
    .add(function (this: Doc) {
      this.styles.add(/* CSS */ `
            .platform-title {
              font-family: Ubuntu, Arial, sans-serif;
              font-size: .8cm;
              line-height: 1.2;
              font-weight: bold;
              color: #1d727c;
              font-weight: bold;
            }
    
            header {
              width: 100%;
              padding: 0 .6cm;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              gap: .5cm;
              height: 1.6cm;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5mm;
              margin-bottom: 1cm;
            }
            .platform-logo {
              height: 1.6cm;
              width: auto;
            }`)
      this.content.push(/* HTML */ `
        <header>
          <img class="platform-logo" src="${logoDataUrl}" alt="Organization Logo" />
          <span class="platform-title">${organisation.value?.$t.name}</span>
        </header>
      `)
    })
    .getContent()
  return headerContent
}
