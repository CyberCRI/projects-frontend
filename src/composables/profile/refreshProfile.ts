import type { ProfileModel, TranslatedProfile } from 'shared-projects-frontend/models'

export const refreshProfileData = <T extends ProfileModel | TranslatedProfile>(profile: T) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()

  return refreshNuxtData([
    `${organizationCode}::profile::${profile.id}`,
    `${organizationCode}::profile::${profile.slug}`,
    `${organizationCode}::profile::${route.params?.slugOrId}`,
  ])
}

export const refreshProjectTabs = <T extends ProfileModel | TranslatedProfile>(profile: T) => {
  const route = useRoute()

  const organizationCode = useOrganizationCode()

  return refreshNuxtData([
    `${organizationCode}::profile::${profile.id}::tab::all`,
    `${organizationCode}::profile::${profile.slug}::tab::all`,
    `${organizationCode}::profile::${route.params?.slugOrId}::tab::all`,
  ])
}
