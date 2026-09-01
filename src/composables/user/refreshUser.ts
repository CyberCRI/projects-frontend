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
