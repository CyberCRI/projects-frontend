import type { ProjectModel, TranslatedProject } from '~/models/project.model'

export const refreshProjectData = <T extends ProjectModel | TranslatedProject>(project: T) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()

  refreshNuxtData([
    `${organizationCode}::project::${project.id}`,
    `${organizationCode}::project::${project.slug}`,
    `${organizationCode}::project::${route.params?.slugOrId}`,
  ])
}
