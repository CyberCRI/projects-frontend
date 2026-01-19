import { Container } from '@/composables/pdf-helpers/doc-builder'

export default class ProjectHeader extends Container {
  constructor(parent: Container) {
    super(parent)
    this.styles.add(/* CSS */ `
       .project-header {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            gap: .6cm;
            margin-bottom: 1cm;
          }   
          `)
  }

  override getContent(): string {
    return /* HTML */ `
      <div class="project-header">${this.content.join('\n')}</div>
    `
  }
}
