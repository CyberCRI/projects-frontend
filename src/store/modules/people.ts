import { PeopleModel } from '@/models/people.model'
import { searchPeopleProject } from '@/api/people.service'
import { APIResponseList } from '@/api/types'

export interface PeopleState {}

const state = (): PeopleState => ({})

const actions = {
    async searchPeopleProject(_, { search, org_id, param }): Promise<APIResponseList<PeopleModel>> {
        try {
            return await searchPeopleProject({ search, org_id }, param)
        } catch (err) {
            throw new Error(err)
        }
    },
}

export default {
    namespaced: true,
    state,
    actions,
}
