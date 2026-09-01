import type { UserModel, TranslatedUserModel } from 'shared-projects-frontend/models'

export const refreshUserData = <T extends UserModel | TranslatedUserModel>(user: T) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()
  return refreshNuxtData([
    `${organizationCode}::user::${user.id}`,
    `${organizationCode}::user::${user.slug}`,
    `${organizationCode}::user::${route.params?.userIdOrSlug}`,
  ])
}

export const refreshUserFollowedCategories = <T extends UserModel | TranslatedUserModel>(
  user: T
) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()

  const categoriesStore = useProjectCategories()

  categoriesStore.getAllProjectCategories()
  categoriesStore.getRootProjectCategory()

  return refreshNuxtData([
    `${organizationCode}::user::${user.id}::categories::follower`,
    `${organizationCode}::user::${user.slug}::categories::follower`,
    `${organizationCode}::user::${route.params?.userIdOrSlug}::categories::follower`,
  ])
}

export const refreshUserFollowedProject = <T extends UserModel | TranslatedUserModel>(user: T) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()
  return refreshNuxtData([
    `${organizationCode}::user::${user.id}::projects::follower`,
    `${organizationCode}::user::${user.slug}::projects::follower`,
    `${organizationCode}::user::${route.params?.userIdOrSlug}::projects::follower`,
  ])
}
