import { axios } from '@/api/api.config'
import { APIResponseList, SearchParams } from '@/api/types'
import { _adaptParamsToGetQuery } from '@/api/utils.service'
import { ProjectOutput } from '@/models/project.model'

export async function searchProjects(
    search: string,
    params: SearchParams
): Promise<APIResponseList<ProjectOutput>> {
    // const url = search ? `search/project/${search}/` : 'search/project/'
    const url = search ? `search/${search}/` : 'search/'

    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/${url}`,
            _adaptParamsToGetQuery({ ...params, types: 'project' })
        )
    ).data
}

export async function searchGroupsAlgolia(
    search: string,
    params: SearchParams
): Promise<APIResponseList<ProjectOutput>> {
    // const url = search ? `search/people-group/${search}/` : 'search/people-group/'
    const url = search ? `search/${search}/` : 'search/'

    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/${url}`,
            _adaptParamsToGetQuery({ ...params, types: 'people_group' })
        )
    ).data
}

export async function searchGroups(
    organization: string,
    params: SearchParams
): Promise<APIResponseList<ProjectOutput>> {
    return (
        await axios.get(
            `${
                import.meta.env.VITE_APP_API_DEFAULT_VERSION
            }/organization/${organization}/people-group/`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}

export async function searchUser(
    search: string,
    params: SearchParams
): Promise<APIResponseList<ProjectOutput>> {
    // const url = search ? `search/user/${search}/` : 'search/user/'
    const url = search ? `search/${search}/` : 'search/'
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/${url}`,
            _adaptParamsToGetQuery({ ...params, types: 'user' })
        )
    ).data
}

export async function searchAll(
    search: string | null,
    params: SearchParams
): Promise<APIResponseList<ProjectOutput>> {
    // const url = search ? `search/global/${search}/` : 'search/global/'
    const url = search ? `search/${search}/` : 'search/'
    return (
        await axios.get(
            `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/${url}`,
            _adaptParamsToGetQuery(params)
        )
    ).data
}
