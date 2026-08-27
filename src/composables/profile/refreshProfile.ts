import type { ProfileModel, TranslatedProfile } from 'shared-projects-frontend/models'

export const refreshProfileData = <T extends ProfileModel | TranslatedProfile>(profile: T) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()

  return refreshNuxtData([
    `${organizationCode}::user::${profile.id}`,
    `${organizationCode}::user::${profile.slug}`,
    `${organizationCode}::user::${route.params?.slugOrId}`,
  ])
}

export const refreshProfileTabs = <T extends ProfileModel | TranslatedProfile>(profile: T) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()

  return refreshNuxtData([
    `${organizationCode}::profile::${profile.id}::tab::all`,
    `${organizationCode}::profile::${profile.slug}::tab::all`,
    `${organizationCode}::profile::${route.params?.slugOrId}::tab::all`,
  ])
}
