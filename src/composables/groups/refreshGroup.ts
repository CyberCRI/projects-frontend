import type { TranslatedPeopleGroupModel } from '@/models/people-group.model'

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
