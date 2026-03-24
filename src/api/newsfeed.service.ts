import useAPI from '@/composables/useAPI'
import { NewsfeedModel } from '@/models/newsfeed.model'
import { OrganizationModel } from '@/models/organization.model'

export async function getNewsfeed(organizationCode: OrganizationModel['code'], config = {}) {
  return await useAPI<PaginationResult<NewsfeedModel>>(
    `organization/${organizationCode}/newsfeed/`,
    config
  )
}
