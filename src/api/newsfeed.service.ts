// import type { NewsfeedModel } from '@/models/newsfeed.model'
import type { APIParams /*, APIResponseList*/ } from '@/api/types'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import useAPI from '@/composables/useAPI'

export interface NewsfeedParams {
  org: string
  limit: number
}

export async function getNewsfeed(org: string, params: APIParams) {
  return await useAPI(`organization/${org}/newsfeed/`, { ..._adaptParamsToGetQuery(params) })
  //.data.value
}
