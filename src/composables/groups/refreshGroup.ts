import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend'

export const refreshGroupData = <T extends TranslatedPeopleGroupModel | TranslatedPeopleGroupModel>(
  group: T
) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()

  refreshNuxtData([
    `${organizationCode}::group::${group.id}`,
    `${organizationCode}::group::${group.slug}`,
    `${organizationCode}::group::${route.params?.slugOrId}`,
  ])
}
