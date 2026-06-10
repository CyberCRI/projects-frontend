import type { ProjectModel, TranslatedProject } from '~/models/project.model'

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

  return refreshNuxtData([
    `${organizationCode}::project::${project.id}::tab::all`,
    `${organizationCode}::project::${project.slug}::tab::all`,
    `${organizationCode}::project::${route.params?.slugOrId}::tab::all`,
  ])
}
