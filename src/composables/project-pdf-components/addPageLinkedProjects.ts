import addLinkedProjectSectionFactory from '~/composables/project-pdf-components/addLinkedProjectSectionFactory'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import { Page } from '~/composables/pdf-helpers/doc-builder'

export default async function addPageLinkedProjectsFactory(project: any, linkedProjects: any[]) {
  const { t } = useNuxtI18n()

  const addLinkedProjectSection = await addLinkedProjectSectionFactory(linkedProjects || [])

  return function addPageLinkedProjects(this: Doc) {
    if (!linkedProjects?.length) return
    this.addContainer(Page)
      .addContainer(PageTitle)
      .add(function (this: PageTitle) {
        this.content.push(t('project.linked-projects'))
      })
      .render()
      .add(addLinkedProjectSection)
      .render()
  }
}
