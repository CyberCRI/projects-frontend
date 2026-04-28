import { fetchImageAsDataUrl, proxyImageUrl } from '~/composables/pdf-helpers/usePdfHelpers'
import type { Container } from '~/composables/pdf-helpers/doc-builder'
import { usePublicURL } from '~/composables/usePublic'

export default async function addSdgsFactory(projectSdgs: (string | ArrayBuffer)[]) {
  const { locale } = useNuxtI18n()
  const sdgLogoDataUrl = await fetchImageAsDataUrl(proxyImageUrl(usePublicURL(`/sdgs/logo.png`)))
  let sdgImages = []
  if (projectSdgs && projectSdgs.length > 0) {
    sdgImages = await Promise.all(
      (projectSdgs || []).map((sdg) =>
        fetchImageAsDataUrl(proxyImageUrl(usePublicURL(`/sdgs/${locale.value}/${sdg}.svg`)))
      )
    )
  }
  return function addSdgs(this: Container) {
    let sdgs = ''
    if (sdgImages.length > 0) {
      this.styles.add(/* CSS */ `
          .sdg-recap {
            --sdg-size: 1.4cm;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.2cm;
            background: #FFF;
          }
          .sdg-recap > div:first-of-type {
            display: flex;
            align-items: center;
          }
          .sdg-recap .sdg-logo {
            height: var(--sdg-size);
            width: calc(0.8 * var(--sdg-size));
            background-repeat: no-repeat;
            background-size: contain;
            padding: 0 0.2cm;
          }
          .sdg-recap .current-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.2cm;
            width: fit-content;
          }
          .sdg-recap .current-list .sdg {
            height: var(--sdg-size);
            width: var(--sdg-size);
            background-repeat: no-repeat;
            background-size: contain;
          }`)
      const sdgList = sdgImages
        .map(
          (dataUrl) =>
            /*HTML*/ `<img class="sdg" src="${dataUrl}" alt="SDG ${sdgImages.indexOf(dataUrl) + 1}" />`
        )
        .join('')

      sdgs = /* HTML */ `
        <div class="sdg-recap">
          <div>
            <img src="${sdgLogoDataUrl}" class="sdg-logo" />
            <div class="current-list">${sdgList}</div>
          </div>
        </div>
      `
    }
    this.content.push(sdgs)
  }
}
