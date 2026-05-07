import type { ProjectModel } from '~/models/project.model'

export const refreshProjectData = <T extends ProjectModel>(project: T) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()

  refreshNuxtData([
    `${organizationCode}::project::${project.id}`,
    `${organizationCode}::project::${project.slug}`,
    `${organizationCode}::project::${route.params?.slugOrId}`,
  ])
}
