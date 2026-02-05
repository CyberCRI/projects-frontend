import { Container } from '@/composables/pdf-helpers/doc-builder'

export default function addTagsFactory(project, locale) {
  const tagTitle = (tag) => tag[`title_${locale.value}`] || tag.title

  return function addTags(this: Container) {
    let tags = ''
    if (project?.tags?.length) {
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
        .map((tag) => /*HTML*/ `<span class="tag">${tagTitle(tag)}</span>`)
        .join('')
      tags = /* HTML */ `
        <div class="tags">${tagList}</div>
      `
    }
    this.content.push(tags)
  }
}
