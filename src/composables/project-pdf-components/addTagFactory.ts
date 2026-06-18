import type { Container } from '~/composables/pdf-helpers/doc-builder'
import type { TranslatedProject } from '~/models/project.model'

export default function addTagsFactory(project: TranslatedProject) {
  const tagTexts = useTagTexts()

  return function addTags(this: Container) {
    if (!project.tags?.length) {
      return
    }
    this.styles.add(/* CSS */ `
          .tags {
            font-size: .8rem;
            display: flex;
            flex-flow: row wrap;
            gap: .1cm;
          }
          .tag {
            display: inline-block;
            padding: .1cm .2cm;
            background-color: #99ffe7;
            color: #1d727c;
            font-weight: 700;
            margin: 0;
            text-transform: uppercase;
            border-radius: .1cm;
            line-height: 1;
          }`)
    const tagList = project.tags
      .map((tag) => /*HTML*/ `<span class="tag">${tagTexts.title(tag)}</span>`)
      .join('')
    this.content.push(/* HTML */ `
      <div class="tags">${tagList}</div>
    `)
  }
}
