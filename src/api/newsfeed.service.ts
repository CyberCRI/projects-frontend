import type { OrganizationModel } from '~/models/organization.model'
import type { NewsfeedModel } from '~/models/newsfeed.model'

import useAPI from '~/composables/useAPI'

export async function getNewsfeed(organizationCode: OrganizationModel['code'], config = {}) {
  return await useAPI<PaginationResult<NewsfeedModel>>(
    `organization/${organizationCode}/newsfeed/`,
    config
  )
}
