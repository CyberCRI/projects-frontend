import type {
  OrganizationModel,
  QueryFilterSkill,
  SkillModel,
  UserSlugOrId,
} from 'shared-projects-frontend/models'
import {
  getUserSkills as fetchUserSkills,
  getUserSkill as fetchUserSkill,
} from 'shared-projects-frontend/apis'
import type { UseAsyncApiConfig, UseAsyncPaginationApiConfig } from '~/api/v2/base.service'
import type { RefOrRaw } from '~/interfaces/utils'
import { onlyRefs } from '~/functs/onlyRefs'

const DEFAULT_CONFIG = {}

type Config = UseAsyncApiConfig<QueryFilterSkill>
type ConfigPagination = UseAsyncPaginationApiConfig<QueryFilterSkill>

// TODO change backend with prefix organization code in url
export const getUserSkills = (
  organization: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  config: ConfigPagination = {}
) => {
  const key = computed(() => `${unref(organization)}::user::${unref(userId)}::skills::all`)

  const { translateSkills } = useAutoTranslate()

  return useAsyncPaginationAPI(
    key,
    ({ config }) =>
      fetchUserSkills(unref(userId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (skills) => translateSkills(skills),
      watch: onlyRefs([organization, userId]),
      ...config,
    }
  )
}

export const getUserSkill = (
  organization: RefOrRaw<OrganizationModel['code']>,
  userId: RefOrRaw<UserSlugOrId>,
  skillId: RefOrRaw<SkillModel['id']>,
  config: Config = {}
) => {
  const key = computed(
    () => `${unref(organization)}::user::${unref(userId)}::skills::${unref(skillId)}`
  )

  const { translateSkill } = useAutoTranslate()

  return useAsyncAPI(
    key,
    ({ config }) =>
      fetchUserSkill(unref(userId), unref(skillId), {
        ...DEFAULT_CONFIG,
        ...config,
      }),
    {
      translate: (skill) => translateSkill(skill),
      watch: onlyRefs([organization, userId, skillId]),
      ...config,
    }
  )
}
