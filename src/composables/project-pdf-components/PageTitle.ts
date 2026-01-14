import { Container } from '@/composables/pdf-helpers/doc-builder'

export default class PageTitle extends Container {
  constructor(parent: Container) {
    super(parent)
    this.styles.add(/* CSS */ `
       .chapter-title {
          font-size: 1.6rem;
          font-weight: bold;
          margin-bottom: .6cm;
          color: #1d727c;
        } 
        `)
  }

  override getContent(): string {
    return /* HTML */ `
      <h2 class="chapter-title">${this.content.join('\n')}</h2>
    `
  }
}
