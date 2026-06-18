import addGoalsSectionFactory from '~/composables/project-pdf-components/addGoalsSectionFactory'
import PageTitle from '~/composables/project-pdf-components/PageTitle'
import type { Doc } from '~/composables/pdf-helpers/doc-builder'
import type { TranslatedProject } from '~/models/project.model'
import { Page } from '~/composables/pdf-helpers/doc-builder'
import { getProjectGoals } from '~/api/goals.service'

export default async function addGoalsSection(project: TranslatedProject) {
  const { t } = useNuxtI18n()

  const { translateGoals } = useAutoTranslate()

  const goals = unref(translateGoals((await getProjectGoals(project.id)).results))

  const sortedGoals = [...goals].sort((a, b) => {
    if (!a.deadline_at && !b.deadline_at) {
      return a.title < b.title ? -1 : 1
    } else if (!a.deadline_at) {
      return -1
    } else if (!b.deadline_at) {
      return 1
    } else {
      return a.deadline_at < b.deadline_at ? -1 : 1
    }
  })

  const addGoalsSection = await addGoalsSectionFactory(sortedGoals)

  return function addGoalsSectionFactory(this: Doc) {
    if (sortedGoals.length === 0) {
      return
    }
    this.addContainer(Page)
      .addContainer(PageTitle)
      .add(function (this: PageTitle) {
        this.content.push(t('goal.goals'))
      })
      .render()
      .add(addGoalsSection)
      .render()
  }
}
