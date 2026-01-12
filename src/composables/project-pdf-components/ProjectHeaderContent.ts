import { Container } from '@/composables/pdf-helpers/doc-builder'

export default class ProjectHeaderContent extends Container {
  constructor(parent: Container) {
    super(parent)
    this.styles.add(/* CSS */ `
          .project-header-content {
            flex-grow: 1;
          }
      `)
  }

  override getContent(): string {
    return /* HTML */ `
      <div class="project-header-content">${this.content.join('\n')}</div>
    `
  }
}
