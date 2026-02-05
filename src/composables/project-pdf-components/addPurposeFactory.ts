import { Container } from '@/composables/pdf-helpers/doc-builder'

export default function addPurposeFactory(project) {
  return function addPurpose(this: Container) {
    let purpose = ''
    if (project.$t.purpose) {
      this.styles.add(/* CSS */ `
          .purpose {
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: .6cm;
          }`)
      purpose = /* HTML */ `
        <h4 class="purpose">${project.$t.purpose}</h4>
      `
    }
    this.content.push(purpose)
  }
}
