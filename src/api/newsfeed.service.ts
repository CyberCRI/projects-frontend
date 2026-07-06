import type { OrganizationModel, NewsfeedModel } from 'shared-projects-frontend'

import useAPI from '~/composables/useAPI'

export async function getNewsfeed(organizationCode: OrganizationModel['code'], config = {}) {
  return await useAPI<PaginationResult<NewsfeedModel>>(
    `organization/${organizationCode}/newsfeed/`,
    config
  )
}
