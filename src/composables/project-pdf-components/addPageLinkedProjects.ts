import addLinkedProjectSectionFactory from '~/composables/project-pdf-components/addLinkedProjectSectionFactory'
import type { TranslatedProject } from 'shared-projects-frontend/models'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import { getLinkedProject } from 'shared-projects-frontend/apis'
import { Page } from '~/composables/pdf-helpers/doc-builder'

export default async function addPageLinkedProjectsFactory(project: TranslatedProject) {
  const { t } = useNuxtI18n()

  const { translatedProjectLinkeds } = useAutoTranslate()

  const linkedProjects = unref(
    translatedProjectLinkeds((await getLinkedProject(project.id, { query: { limit: 10 } })).results)
  )

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
