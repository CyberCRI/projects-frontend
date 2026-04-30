import { _adaptParamsToGetQuery } from '~/api/utils.service'
import type { SearchParams } from '~/api/types'

import useAPI from '~/composables/useAPI'

export async function searchProjects(search: string, params: SearchParams) {
  // const url = search ? `search/project/${search}/` : 'search/project/'
  const url = search ? `search/${search}/` : 'search/'

  return await useAPI(`${url}`, { ..._adaptParamsToGetQuery({ ...params, types: 'project' }) })
}

export async function searchGroupsAlgolia(search: string, params: SearchParams) {
  // const url = search ? `search/people-group/${search}/` : 'search/people-group/'
  const url = search ? `search/${search}/` : 'search/'

  return await useAPI(`${url}`, {
    ..._adaptParamsToGetQuery({ ...params, types: 'people_group' }),
  })
}

export async function searchGroups(organization: string, params: SearchParams) {
  return await useAPI(`organization/${organization}/people-group/`, {
    ..._adaptParamsToGetQuery(params),
  })
}

export async function searchUser(search: string, params: SearchParams) {
  // const url = search ? `search/user/${search}/` : 'search/user/'
  const url = search ? `search/${search}/` : 'search/'
  return await useAPI(`${url}`, { ..._adaptParamsToGetQuery({ ...params, types: 'user' }) })
}

export async function searchAll(search: string | null, params: SearchParams) {
  // const url = search ? `search/global/${search}/` : 'search/global/'
  const url = search ? `search/${search}/` : 'search/'
  return await useAPI(`${url}`, { ..._adaptParamsToGetQuery(params) })
}
