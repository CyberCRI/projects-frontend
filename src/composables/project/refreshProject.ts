import type { ProjectModel, TranslatedProject } from 'shared-projects-frontend/models'

export const refreshProjectData = <T extends ProjectModel | TranslatedProject>(project: T) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()

  return refreshNuxtData([
    `${organizationCode}::project::${project.id}`,
    `${organizationCode}::project::${project.slug}`,
    `${organizationCode}::project::${route.params?.slugOrId}`,
  ])
}

export const refreshProjectTabs = <T extends ProjectModel | TranslatedProject>(project: T) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()

  const tabs = [
    `${organizationCode}::project::${project.id}::tab::all`,
    `${organizationCode}::project::${project.slug}::tab::all`,
    `${organizationCode}::project::${route.params?.slugOrId}::tab::all`,
  ]

  const finalsTabs = []

  tabs.forEach((key) => {
    ;['preview', 'menu', 'settings'].forEach((uniqueKey) => {
      finalsTabs.push(`${key}+${uniqueKey}`)
    })
  })

  return refreshNuxtData(finalsTabs)
}
