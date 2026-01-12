import { Container } from '@/composables/pdf-helpers/doc-builder'

export default function addSdgsFactory(sdgImages: (string | ArrayBuffer)[]) {
  return function addSdgs(this: Container) {
    let sdgs = ''
    if (sdgImages.length > 0) {
      this.styles.add(/* CSS */ `
          .sdgs {
            margin-top: .6cm;
            display: flex;
            flex-direction: row;
            gap: .2cm;
            flex-wrap: wrap;
          }
          .sdg-image {
            width: 1.2cm;
            height: auto;
          }`)
      const sdgList = sdgImages
        .map(
          (dataUrl) =>
            /*HTML*/ `<img class="sdg-image" src="${dataUrl}" alt="SDG ${sdgImages.indexOf(dataUrl) + 1}" />`
        )
        .join('')

      sdgs = /* HTML */ `
        <div class="sdgs">${sdgList}</div>
      `
    }
    this.content.push(sdgs)
  }
}
